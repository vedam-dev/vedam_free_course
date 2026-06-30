import { NextRequest, NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const authError = await requireAdminSession(request);
  if(authError) return authError;

  try {
    // Fetch all UTM data
    const { data: utmData, error: utmError } = await supabase
      .from('utm-data')
      .select('*')
      .order('created_at', { ascending: true });
    console.log('UTMDATA', utmData);
    if(utmError) {
      console.error('Supabase UTM data error:', utmError);
      return NextResponse.json(
        { error: 'Failed to fetch UTM data' },
        { status: 500 }
      );
    }

    if(!utmData || utmData.length === 0) {
      return NextResponse.json({
        totalVisitors: 0,
        totalVerifiedUsers: 0,
        totalConversionRate: 0,
        topSources: [],
        topCampaigns: [],
        topMediums: [],
        dailyVisitors: [],
        verificationTrend: [],
      });
    }

    // Calculate basic metrics
    const totalVisitors = utmData.length;
    const totalVerifiedUsers = utmData.filter(item => item.isVerified).length;
    const totalConversionRate = totalVisitors > 0 ? (totalVerifiedUsers / totalVisitors) * 100 : 0;

    // Process source data
    const sourceCounts: { [key: string]: number } = {};
    utmData.forEach(item => {
      const source = item.source || 'direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Process campaign data
    const campaignCounts: { [key: string]: number } = {};
    utmData.forEach(item => {
      const campaign = item.campaign || 'none';
      campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1;
    });

    const topCampaigns = Object.entries(campaignCounts)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Process medium data
    const mediumCounts: { [key: string]: number } = {};
    utmData.forEach(item => {
      const medium = item.medium || 'none';
      mediumCounts[medium] = (mediumCounts[medium] || 0) + 1;
    });

    const topMediums = Object.entries(mediumCounts)
      .map(([medium, count]) => ({ medium, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Process daily visitors
    const dailyCounts: { [key: string]: number } = {};
    utmData.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const dailyVisitors = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days

    // Process verification trend
    const verificationCounts: { [key: string]: { verified: number; total: number } } = {};
    utmData.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if(!verificationCounts[date]) {
        verificationCounts[date] = { verified: 0, total: 0 };
      }
      verificationCounts[date].total += 1;
      if(item.isVerified) {
        verificationCounts[date].verified += 1;
      }
    });

    const verificationTrend = Object.entries(verificationCounts)
      .map(([date, counts]) => ({
        date,
        verified: counts.verified,
        total: counts.total,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days


    // usersData
    type UserData = {
      userId: number,
      isUserVerified: boolean,
      userSource: string | null,
      userMedium: string | null,
      userCampaign: string | null,
      userRecordedAt: string,
    }
    const usersData: UserData[] = [];
    // IIFE
    (function exctractUsersData() {
      utmData?.map(item => {
        const { id, isVerified, source, medium, campaign, created_at } = item;
        const userData: UserData = {
          userId: id,
          isUserVerified: isVerified,
          userSource: source,
          userMedium: medium,
          userCampaign: campaign,
          userRecordedAt: created_at,
        };
        usersData.push(userData);
      });
    }());





    return NextResponse.json({
      totalVisitors,
      totalVerifiedUsers,
      totalConversionRate,
      topSources,
      topCampaigns,
      topMediums,
      dailyVisitors,
      verificationTrend,
      usersData
    });
  } catch(error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
