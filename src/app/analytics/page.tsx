'use client';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Box, Button, Card, Container, Typography } from '@mui/material';
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

import { RootState } from '@/lib/store';


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

interface UTMAnalytics {
  totalVisitors: number;
  verifiedUsers: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  topCampaigns: { campaign: string; count: number }[];
  topMediums: { medium: string; count: number }[];
  dailyVisitors: { date: string; count: number }[];
  verificationTrend: { date: string; verified: number; total: number }[];
}

export default function AnalyticsPage() {
  // const theme = useTheme();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [analytics, setAnalytics] = useState<UTMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin authentication state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if(
      username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials');
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if(!isLoggedIn) {
      router.push('/');
      return;
    }
    if(isAuthenticated) {
      fetchAnalytics();
    }
  }, [isLoggedIn, isAuthenticated, router]);

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

  // Show authentication form if not authenticated
  if(!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Analytics Dashboard Login
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Username
              </Typography>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
                required
                autoFocus
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Password
              </Typography>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px',
                }}
                required
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={authLoading}
              sx={{ mt: 2 }}
            >
              {authLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

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
    labels: analytics.topSources.map(item => item.source || 'Direct'),
    datasets: [
      {
        label: 'Visitors by Source',
        data: analytics.topSources.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  };

  const campaignChartData = {
    labels: analytics.topCampaigns.map(item => item.campaign || 'No Campaign'),
    datasets: [
      {
        label: 'Visitors by Campaign',
        data: analytics.topCampaigns.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const mediumChartData = {
    labels: analytics.topMediums.map(item => item.medium || 'None'),
    datasets: [
      {
        label: 'Visitors by Medium',
        data: analytics.topMediums.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dailyVisitorsData = {
    labels: analytics.dailyVisitors.map(item => item.date),
    datasets: [
      {
        label: 'Daily Visitors',
        data: analytics.dailyVisitors.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const verificationTrendData = {
    labels: analytics.verificationTrend.map(item => item.date),
    datasets: [
      {
        label: 'Verified Users',
        data: analytics.verificationTrend.map(item => item.verified),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Total Visitors',
        data: analytics.verificationTrend.map(item => item.total),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        </Box>
      </Box>

      {/* Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {analytics.totalVisitors.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Visitors
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {analytics.verifiedUsers.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verified Users
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {analytics.conversionRate.toFixed(1)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Conversion Rate
          </Typography>
        </Card>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" color="info.main">
            {analytics.topSources.length}
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