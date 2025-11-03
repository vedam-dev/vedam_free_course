import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get total count of videos
    const { data: totalVideos, error: videosError } = await supabase
      .from('content')
      .select('id', { count: 'exact' });

    if(videosError) {
      console.error('Error fetching total videos:', videosError);
      return NextResponse.json(
        { error: 'Failed to fetch total videos count' },
        { status: 500 }
      );
    }

    const totalVideoCount = totalVideos?.length || 0;

    // Get all users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, mobile, passout_year, stream, created_at')
      .order('created_at', { ascending: false });

    if(usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Get progress data for all users
    const { data: allProgress, error: progressError } = await supabase
      .from('progress')
      .select('user_id, content_id, is_complete, timestamp')
      .eq('is_complete', true);

    if(progressError) {
      console.error('Error fetching progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      );
    }

    // Group progress by user_id and count completed videos
    const userProgressMap = new Map<string, number>();
    const userLastCompletionMap = new Map<string, string>();

    allProgress?.forEach(progress => {
      const userId = progress.user_id.toString();
      userProgressMap.set(userId, (userProgressMap.get(userId) || 0) + 1);

      // Track the most recent completion date
      const currentDate = progress.timestamp || '';
      const existingDate = userLastCompletionMap.get(userId) || '';
      if(!existingDate || new Date(currentDate) > new Date(existingDate)) {
        userLastCompletionMap.set(userId, currentDate);
      }
    });

    // Add completion details to each student
    const studentsWithProgress = allUsers?.map(student => {
      const completedCount = userProgressMap.get(student.id.toString()) || 0;
      const completionPercentage = totalVideoCount > 0 ?
        Math.round((completedCount / totalVideoCount) * 100) : 0;
      const lastCompletionDate = userLastCompletionMap.get(student.id.toString());

      return {
        ...student,
        completedVideos: completedCount,
        totalVideos: totalVideoCount,
        completionPercentage,
        lastCompletionDate,
        status: completedCount >= totalVideoCount ? 'Completed' :
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

    return NextResponse.json({
      data: {
        students: studentsWithProgress,
        totalStudents: allUsers?.length || 0,
        totalVideos: totalVideoCount
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
