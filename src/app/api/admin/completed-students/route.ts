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

    if(totalVideoCount === 0) {
      return NextResponse.json({
        data: {
          completedStudents: [],
          totalStudents: 0,
          totalVideos: 0,
          completionStats: {
            totalStudents: 0,
            completedStudents: 0,
            completionPercentage: 0
          }
        }
      });
    }

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
    allProgress?.forEach(progress => {
      const userId = progress.user_id.toString();
      userProgressMap.set(userId, (userProgressMap.get(userId) || 0) + 1);
    });

    // Find students who have completed all videos
    const completedStudents = allUsers?.filter(user => {
      const completedCount = userProgressMap.get(user.id.toString()) || 0;
      return completedCount >= totalVideoCount;
    }) || [];

    // Calculate completion statistics
    const totalStudents = allUsers?.length || 0;
    const completedCount = completedStudents.length;
    const completionPercentage = totalStudents > 0 ?
      Math.round((completedCount / totalStudents) * 100) : 0;

    // Add completion details to each student
    const studentsWithDetails = completedStudents.map(student => ({
      ...student,
      completedVideos: userProgressMap.get(student.id.toString()) || 0,
      totalVideos: totalVideoCount,
      completionDate: allProgress
        ?.filter(p => p.user_id === student.id)
        ?.sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())[0]?.timestamp
    }));

    return NextResponse.json({
      data: {
        completedStudents: studentsWithDetails,
        totalStudents,
        totalVideos: totalVideoCount,
        completionStats: {
          totalStudents,
          completedStudents: completedCount,
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
