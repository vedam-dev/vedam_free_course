import { UTMAnalytics } from '../analytics/page';

export const filterTrafficSources = (
  data: UTMAnalytics,
  filters: {
    source?: string;
    medium?: string;
    campaign?: string;
    startDate?: Date | null;
    endDate?: Date | null;
  }
): UTMAnalytics => {
  // Filter topSources
  const filteredTopSources = data.topSources.filter(item =>
    filters.source ? item.source.toLowerCase().includes(filters.source.toLowerCase()) : true
  );

  // Filter topMediums
  const filteredTopMediums = data.topMediums.filter(item =>
    filters.medium ? item.medium.toLowerCase().includes(filters.medium.toLowerCase()) : true
  );

  // Filter topCampaigns
  const filteredTopCampaigns = data.topCampaigns.filter(item =>
    filters.campaign ? item.campaign.toLowerCase().includes(filters.campaign.toLowerCase()) : true
  );

  // Filter dailyVisitors by date range
  const filteredDailyVisitors = data.dailyVisitors.filter(item => {
    const itemDate = new Date(item.date);
    if(filters.startDate && itemDate < filters.startDate) return false;
    if(filters.endDate && itemDate > filters.endDate) return false;
    return true;
  });

  // Filter verificationTrend by date range
  const filteredVerificationTrend = data.verificationTrend.filter(item => {
    const itemDate = new Date(item.date);
    if(filters.startDate && itemDate < filters.startDate) return false;
    if(filters.endDate && itemDate > filters.endDate) return false;
    return true;
  });

  return {
    ...data,
    topSources: filteredTopSources,
    topMediums: filteredTopMediums,
    topCampaigns: filteredTopCampaigns,
    dailyVisitors: filteredDailyVisitors,
    verificationTrend: filteredVerificationTrend,
    // Update totals based on filtered daily data
    totalVisitors: filteredDailyVisitors.reduce((sum, item) => sum + item.count, 0),
    verifiedUsers: filteredVerificationTrend.reduce((sum, item) => sum + item.verified, 0),
    conversionRate: filteredDailyVisitors.length > 0 ?
      (filteredVerificationTrend.reduce((sum, item) => sum + item.verified, 0) /
      filteredDailyVisitors.reduce((sum, item) => sum + item.count, 0)) * 100 : 0
  };
};