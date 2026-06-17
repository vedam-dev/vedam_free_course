import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if(!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    return NextResponse.json({ data }, { status: 200 });
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
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if(!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content_id, is_complete } = body;

    if(!content_id || typeof is_complete !== 'boolean') {
      return NextResponse.json(
        { error: 'content_id and is_complete are required' },
        { status: 400 }
      );
    }

    const { data: existing, error: selectError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
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
      const { data, error } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          content_id,
          is_complete,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if(error) throw error;
      result = data;
    }

    if(is_complete && result) {
      try {
        const certificateData = await checkTopicCompletion(userId, content_id);
        if(certificateData) {
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

async function checkTopicCompletion(
  userId: string,
  contentId: string | number
): Promise<{ studentName: string; subjectName: string; studentEmail: string } | null> {
  try {
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

    if(completedCount >= totalVideosInTopic) {
      let certificateAlreadySent = false;
      try {
        const { data: existingCert, error: certCheckError } = await supabase
          .from('certificates_sent')
          .select('id')
          .eq('user_id', userId)
          .eq('topic', topic)
          .maybeSingle();

        if(certCheckError) {
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
        console.log('Error checking certificates_sent table:', err);
      }

      if(certificateAlreadySent) {
        console.log(`Certificate already sent for user ${userId} and topic ${topic}`);
        return null;
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', userId)
        .single();

      if(userError || !user || !user.email) {
        console.error('Error fetching user for certificate:', userError);
        return null;
      }

      try {
        await supabase
          .from('certificates_sent')
          .insert({
            user_id: userId,
            topic,
            sent_at: new Date().toISOString()
          });
      } catch(err: unknown) {
        const errorMessage = (err as { message?: string; code?: string }).message || '';
        if(errorMessage.includes('does not exist') || errorMessage.includes('relation') || (err as { code?: string }).code === '42P01') {
          console.log('certificates_sent table does not exist, skipping tracking');
        } else {
          console.error('Error recording certificate sent:', err);
        }
      }

      console.log(`✅ Topic completed! Certificate ready for ${user.email}, topic: ${topic}`);

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