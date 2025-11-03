import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic');

    if(!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      );
    }

    // Get all videos for the selected topic
    const { data: topicVideos, error: videosError } = await supabase
      .from('content')
      .select('id')
      .eq('topic', topic);

    if(videosError) {
      console.error('Error fetching topic videos:', videosError);
      return NextResponse.json(
        { error: 'Failed to fetch topic videos' },
        { status: 500 }
      );
    }

    const topicVideoIds = topicVideos?.map(v => v.id) || [];
    const topicVideoCount = topicVideoIds.length;

    if(topicVideoCount === 0) {
      return NextResponse.json({
        data: {
          students: [],
          totalStudents: 0,
          totalVideos: 0,
          topic
        }
      });
    }

    // Get all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, mobile, created_at')
      .order('created_at', { ascending: false });

    if(usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Get progress data for the selected topic videos only
    const { data: topicProgress, error: progressError } = await supabase
      .from('progress')
      .select('user_id, content_id, is_complete, timestamp')
      .eq('is_complete', true)
      .in('content_id', topicVideoIds);

    if(progressError) {
      console.error('Error fetching progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      );
    }

    // Group progress by user_id and count completed videos for this topic
    const userProgressMap = new Map<string, number>();
    const userLastCompletionMap = new Map<string, string>();

    topicProgress?.forEach(progress => {
      const userId = progress.user_id.toString();
      userProgressMap.set(userId, (userProgressMap.get(userId) || 0) + 1);

      // Track the most recent completion date for this topic
      const currentDate = progress.timestamp || '';
      const existingDate = userLastCompletionMap.get(userId) || '';
      if(!existingDate || new Date(currentDate) > new Date(existingDate)) {
        userLastCompletionMap.set(userId, currentDate);
      }
    });

    // Add completion details to each student
    const studentsWithProgress = allUsers?.map(student => {
      const completedCount = userProgressMap.get(student.id.toString()) || 0;
      const completionPercentage = topicVideoCount > 0 ?
        Math.round((completedCount / topicVideoCount) * 100) : 0;
      const lastCompletionDate = userLastCompletionMap.get(student.id.toString());

      return {
        ...student,
        completedVideos: completedCount,
        totalVideos: topicVideoCount,
        completionPercentage,
        lastCompletionDate,
        status: completedCount >= topicVideoCount ? 'Completed' :
          completedCount > 0 ? 'In Progress' : 'Not Started'
      };
    }) || [];

    // Sort by completion percentage (highest first), then by name
    studentsWithProgress.sort((a, b) => {
      if(b.completionPercentage !== a.completionPercentage) {
        return b.completionPercentage - a.completionPercentage;
      }
      return a.name.localeCompare(b.name);
    });

    // Calculate completion statistics for this topic
    const totalStudents = allUsers?.length || 0;
    const completedStudents = studentsWithProgress
      .filter(s => s.completionPercentage === 100).length;
    const completionPercentage = totalStudents > 0 ?
      Math.round((completedStudents / totalStudents) * 100) : 0;

    return NextResponse.json({
      data: {
        students: studentsWithProgress,
        totalStudents,
        totalVideos: topicVideoCount,
        topic,
        completionStats: {
          totalStudents,
          completedStudents,
          completionPercentage
        }
      }
    });

  } catch(error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

