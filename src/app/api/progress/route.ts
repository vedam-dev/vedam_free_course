import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');

    if(!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    // Fetch user progress with related content information
    const { data, error } = await supabase
      .from('progress')
      .select(`
        *,
        content:content_id (id,shortcode)
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if(error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data },
      { status: 200 }
    );
  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, content_id, is_complete } = body;

    if(!user_id || !content_id || typeof is_complete !== 'boolean') {
      return NextResponse.json(
        { error: 'user_id, content_id, and is_complete are required' },
        { status: 400 }
      );
    }

    // First check if the record exists
    const { data: existing, error: selectError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('content_id', content_id)
      .maybeSingle();

    if(selectError) {
      console.error('Supabase select error:', selectError);
      return NextResponse.json(
        { error: 'Failed to check existing progress' },
        { status: 500 }
      );
    }

    let result;
    if(existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('progress')
        .update({
          is_complete,
          timestamp: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if(error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id,
          content_id,
          is_complete,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if(error) throw error;
      result = data;
    }

    // Check if topic completion should trigger certificate
    // Only check when marking as complete, not when unmarking
    if(is_complete && result) {
      try {
        const certificateData = await checkTopicCompletion(user_id, content_id);

        if(certificateData) {
          // Return response with certificate flag
          return NextResponse.json(
            {
              data: result,
              certificateRequired: true,
              certificateData
            },
            { status: existing ? 200 : 201 }
          );
        }
      } catch(certError) {
        // Log error but don't fail the progress update
        console.error('Error checking topic completion for certificate:', certError);
      }
    }

    return NextResponse.json(
      { data: result },
      { status: existing ? 200 : 201 }
    );
  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Check if user has completed all videos in a topic
 * Returns certificate data if topic is completed, null otherwise
 */
async function checkTopicCompletion(
  userId: string | number,
  contentId: string | number
): Promise<{ studentName: string; subjectName: string; studentEmail: string } | null> {
  try {
    // Get the content to find its topic
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('id, topic')
      .eq('id', contentId)
      .single();

    if(contentError || !content || !content.topic) {
      console.log('Content not found or has no topic:', contentId);
      return null;
    }

    const topic = content.topic;

    // Get all videos for this topic
    const { data: topicVideos, error: videosError } = await supabase
      .from('content')
      .select('id')
      .eq('topic', topic);

    if(videosError || !topicVideos || topicVideos.length === 0) {
      console.log('No videos found for topic:', topic);
      return null;
    }

    const topicVideoIds = topicVideos.map(v => v.id);
    const totalVideosInTopic = topicVideoIds.length;

    // Get user's completed videos for this topic
    const { data: completedProgress, error: progressError } = await supabase
      .from('progress')
      .select('content_id')
      .eq('user_id', userId)
      .eq('is_complete', true)
      .in('content_id', topicVideoIds);

    if(progressError) {
      console.error('Error fetching progress for topic completion:', progressError);
      return null;
    }

    const completedCount = completedProgress?.length || 0;

    // Check if user has completed all videos in this topic
    if(completedCount >= totalVideosInTopic) {
      // Check if certificate already sent for this topic
      let certificateAlreadySent = false;
      try {
        const { data: existingCert, error: certCheckError } = await supabase
          .from('certificates_sent')
          .select('id')
          .eq('user_id', userId)
          .eq('topic', topic)
          .maybeSingle();

        if(certCheckError) {
          // If table doesn't exist, continue
          const errorMessage = certCheckError.message || '';
          if(errorMessage.includes('does not exist') || errorMessage.includes('relation') || certCheckError.code === '42P01') {
            console.log('certificates_sent table does not exist, proceeding without duplicate check');
          } else {
            console.error('Error checking existing certificates:', certCheckError);
            return null;
          }
        } else if(existingCert) {
          certificateAlreadySent = true;
        }
      } catch(err) {
        console.log('Error checking certificates_sent table, proceeding without duplicate check:', err);
      }

      // If certificate already sent, skip
      if(certificateAlreadySent) {
        console.log(`Certificate already sent for user ${userId} and topic ${topic}`);
        return null;
      }

      // Get user details
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', userId)
        .single();

      if(userError || !user || !user.email) {
        console.error('Error fetching user for certificate:', userError);
        return null;
      }

      // Record that certificate will be sent (to prevent duplicates)
      try {
        await supabase
          .from('certificates_sent')
          .insert({
            user_id: userId,
            topic: topic,
            sent_at: new Date().toISOString()
          });
      } catch(err: unknown) {
        // If table doesn't exist, just log
        const errorMessage = (err as { message?: string; code?: string }).message || '';
        if(errorMessage.includes('does not exist') || errorMessage.includes('relation') || (err as { code?: string }).code === '42P01') {
          console.log('certificates_sent table does not exist, skipping tracking');
        } else {
          console.error('Error recording certificate sent:', err);
        }
      }

      console.log(`✅ Topic completed! Certificate data ready for user ${user.email}, topic: ${topic}`);

      // Return certificate data for client-side generation
      return {
        studentName: user.name,
        subjectName: topic,
        studentEmail: user.email
      };
    }

    return null;
  } catch(error) {
    console.error('Error in checkTopicCompletion:', error);
    return null;
  }
}