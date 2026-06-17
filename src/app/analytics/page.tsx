'use client';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import LogoutButton from '@/components/LogoutButton';
import { RootState } from '@/lib/store';

import UTMFilters, { Filters } from './UTMFilters';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export interface UTMAnalytics {
  totalVisitors: number;
  totalVerifiedUsers: number;
  totalConversionRate: number;
  topSources: { source: string; count: number }[];
  topCampaigns: { campaign: string; count: number }[];
  topMediums: { medium: string; count: number }[];
  dailyVisitors: { date: string; count: number }[];
  verificationTrend: { date: string; verified: number; total: number }[];
  usersData: Array<{
    userSource: string,
    userMedium: string,
    userCampaign: string,
    userId: number,
    userRecordedAt: string,
    isUserVerified: boolean,
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [analytics, setAnalytics] = useState<UTMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [filters, setfilters] = useState<Filters>({ source: '', medium: '', startDate: null, endDate: null });


  useEffect(() => {
    if(!isLoggedIn) {
      router.push('/');
      return;
    }
    fetchAnalytics();
  }, [isLoggedIn, router]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      setAnalytics(data);
    } catch(err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  // filtering logic
  const filterAndRecalculateAnalytics = (
    data: UTMAnalytics,
    filters: Filters
  ): UTMAnalytics => {
    if(!data) return data;


    let filteredUsers = [...data.usersData];

    if(filters.source) {
      filteredUsers = filteredUsers.filter(user =>
        user.userSource?.toLowerCase().includes(filters.source!.toLowerCase())
      );
    }

    if(filters.medium) {
      filteredUsers = filteredUsers.filter(user =>
        user.userMedium?.toLowerCase().includes(filters.medium!.toLowerCase())
      );
    }

    if(filters.startDate || filters.endDate) {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      if(start) start.setHours(0, 0, 0, 0);
      if(end) end.setHours(23, 59, 59, 999);

      filteredUsers = filteredUsers.filter(user => {
        const userDate = new Date(user.userRecordedAt);
        if(start && userDate < start) return false;
        if(end && userDate > end) return false;
        return true;
      });
    }


    const totalVisitors = filteredUsers.length;
    const totalVerifiedUsers = filteredUsers.filter(user => user.isUserVerified).length;
    const totalConversionRate = totalVisitors > 0
      ? (totalVerifiedUsers / totalVisitors) * 100
      : 0;


    const sourceCountMap: Record<string, number> = {};
    filteredUsers.forEach(user => {
      const source = user.userSource || 'Direct';
      sourceCountMap[source] = (sourceCountMap[source] || 0) + 1;
    });
    const topSources = Object.entries(sourceCountMap)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);


    const campaignCountMap: Record<string, number> = {};
    filteredUsers.forEach(user => {
      const campaign = user.userCampaign || 'No Campaign';
      campaignCountMap[campaign] = (campaignCountMap[campaign] || 0) + 1;
    });
    const topCampaigns = Object.entries(campaignCountMap)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count);


    const mediumCountMap: Record<string, number> = {};
    filteredUsers.forEach(user => {
      const medium = user.userMedium || 'None';
      mediumCountMap[medium] = (mediumCountMap[medium] || 0) + 1;
    });
    const topMediums = Object.entries(mediumCountMap)
      .map(([medium, count]) => ({ medium, count }))
      .sort((a, b) => b.count - a.count);


    const dailyVisitorsMap: Record<string, number> = {};
    filteredUsers.forEach(user => {
      const dateStr = new Date(user.userRecordedAt).toISOString().split('T')[0];
      dailyVisitorsMap[dateStr] = (dailyVisitorsMap[dateStr] || 0) + 1;
    });
    const dailyVisitors = Object.entries(dailyVisitorsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));


    const verificationTrendMap: Record<string, { verified: number; total: number }> = {};
    filteredUsers.forEach(user => {
      const dateStr = new Date(user.userRecordedAt).toISOString().split('T')[0];
      if(!verificationTrendMap[dateStr]) {
        verificationTrendMap[dateStr] = { verified: 0, total: 0 };
      }
      verificationTrendMap[dateStr].total++;
      if(user.isUserVerified) {
        verificationTrendMap[dateStr].verified++;
      }
    });
    const verificationTrend = Object.entries(verificationTrendMap)
      .map(([date, counts]) => ({
        date,
        verified: counts.verified,
        total: counts.total
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalVisitors,
      totalVerifiedUsers,
      totalConversionRate,
      topSources,
      topCampaigns,
      topMediums,
      dailyVisitors,
      verificationTrend,
      usersData: filteredUsers
    };
  };


  const filteredAnalytics = analytics
    ? filterAndRecalculateAnalytics(analytics, filters)
    : null;


  if(loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Loading Analytics...
        </Typography>
      </Container>
    );
  }

  if(error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  if(!analytics) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          No data available
        </Typography>
      </Container>
    );
  }

  const sourceChartData = {
    labels: filteredAnalytics?.topSources.map(item => item.source || 'Direct') || [],
    datasets: [{
      label: 'Visitors by Source',
      data: filteredAnalytics?.topSources.map(item => item.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderWidth: 1,
    }],
  };

  const campaignChartData = {
    labels: filteredAnalytics?.topCampaigns.map(item => item.campaign || 'No Campaign') || [],
    datasets: [{
      label: 'Visitors by Campaign',
      data: filteredAnalytics?.topCampaigns.map(item => item.count) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const mediumChartData = {
    labels: filteredAnalytics?.topMediums.map(item => item.medium || 'None') || [],
    datasets: [{
      label: 'Visitors by Medium',
      data: filteredAnalytics?.topMediums.map(item => item.count) || [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderWidth: 1,
    }],
  };

  const dailyVisitorsData = {
    labels: filteredAnalytics?.dailyVisitors.map(item => item.date) || [],
    datasets: [{
      label: 'Daily Visitors',
      data: filteredAnalytics?.dailyVisitors.map(item => item.count) || [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true,
    }],
  };

  const verificationTrendData = {
    labels: filteredAnalytics?.verificationTrend.map(item => item.date) || [],
    datasets: [
      {
        label: 'Verified Users',
        data: filteredAnalytics?.verificationTrend.map(item => item.verified) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Visitors',
        data: filteredAnalytics?.verificationTrend.map(item => item.total) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
        fill: false,
      },
    ],
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <UTMFilters analytics={analytics} setFilter={setfilters} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          UTM Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalytics}
            disabled={loading}
          >
            Refresh
          </Button>
          <LogoutButton />
        </Box>
      </Box>

      {/* Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {filteredAnalytics?.totalVisitors.toLocaleString() || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visitors
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {filteredAnalytics?.totalVerifiedUsers.toLocaleString() || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verified Users
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {filteredAnalytics?.totalConversionRate.toFixed(1) || '0.0'}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversion Rate
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="info.main">
            {filteredAnalytics?.topSources.length || 0}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Traffic Sources
          </Typography>
        </Card>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Traffic Sources */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Traffic Sources
          </Typography>
          <Box sx={{ height: 300 }}>
            <Doughnut
              data={sourceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </Box>
        </Card>

        {/* Campaign Performance */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Campaign Performance
          </Typography>
          <Box sx={{ height: 300 }}>
            <Bar
              data={campaignChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Box>
        </Card>

        {/* Traffic Mediums */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Traffic Mediums
          </Typography>
          <Box sx={{ height: 300 }}>
            <Doughnut
              data={mediumChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </Box>
        </Card>

        {/* Daily Visitors Trend */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Daily Visitors Trend
          </Typography>
          <Box sx={{ height: 300 }}>
            <Line
              data={dailyVisitorsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Box>
        </Card>

        {/* Verification Trend */}
        <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verification Trend
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line
                data={verificationTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
