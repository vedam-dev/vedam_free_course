'use client';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, Button, Card, Container, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
import { useCallback, useEffect, useState } from 'react';
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

export interface UTMAnalytics {
  totalVisitors: number;
  verifiedUsers: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  topCampaigns: { campaign: string; count: number }[];
  topMediums: { medium: string; count: number }[];
  dailyVisitors: { date: string; count: number }[];
  verificationTrend: { date: string; verified: number; total: number }[];
  rawData?: {
    date: string;
    source: string;
    medium: string;
    campaign: string;
    visitors: number;
    verified: number;
  }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [analytics, setAnalytics] = useState<UTMAnalytics | null>(null);
  const [filteredAnalytics, setFilteredAnalytics] = useState<UTMAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin authentication state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [filters, setFilters] = useState({
    source: '',
    medium: '',
    campaign: '',
    startDate: null as Date | null,
    endDate: null as Date | null
  });

  // Filter the analytics data based on current filters
  const applyFilters = useCallback((data: UTMAnalytics) => {
    console.log('Applying filters:', filters);

    // Filter top sources
    const filteredTopSources = data.topSources.filter(item =>
      filters.source ? item.source.toLowerCase().includes(filters.source.toLowerCase()) : true
    );

    // Filter top mediums
    const filteredTopMediums = data.topMediums.filter(item =>
      filters.medium ? item.medium.toLowerCase().includes(filters.medium.toLowerCase()) : true
    );

    // Filter top campaigns
    const filteredTopCampaigns = data.topCampaigns.filter(item =>
      filters.campaign ? item.campaign.toLowerCase().includes(filters.campaign.toLowerCase()) : true
    );

    // Filter daily visitors by date range
    const filteredDailyVisitors = data.dailyVisitors.filter(item => {
      const itemDate = new Date(item.date);
      if(filters.startDate && itemDate < filters.startDate) return false;
      if(filters.endDate && itemDate > filters.endDate) return false;
      return true;
    });

    // Filter verification trend by date range
    const filteredVerificationTrend = data.verificationTrend.filter(item => {
      const itemDate = new Date(item.date);
      if(filters.startDate && itemDate < filters.startDate) return false;
      if(filters.endDate && itemDate > filters.endDate) return false;
      return true;
    });

    const result = {
      ...data,
      topSources: filteredTopSources,
      topMediums: filteredTopMediums,
      topCampaigns: filteredTopCampaigns,
      dailyVisitors: filteredDailyVisitors,
      verificationTrend: filteredVerificationTrend,
      totalVisitors: filteredDailyVisitors.reduce((sum, item) => sum + item.count, 0),
      verifiedUsers: filteredVerificationTrend.reduce((sum, item) => sum + item.verified, 0),
      conversionRate: filteredDailyVisitors.length > 0 ?
        (filteredVerificationTrend.reduce((sum, item) => sum + item.verified, 0) /
        filteredDailyVisitors.reduce((sum, item) => sum + item.count, 0)) * 100 : 0
    };

    console.log('Filtered analytics result:', result);
    return result;
  }, [filters]);

  const handleFilterChange = (key: 'source' | 'medium' | 'campaign', value: string) => {
    console.log(`Filter change - ${key}:`, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilter = (key: 'source' | 'medium' | 'campaign') => {
    console.log(`Clearing filter - ${key}`);
    setFilters(prev => ({ ...prev, [key]: '' }));
  };

  const handleDateChange = (type: 'startDate' | 'endDate', value: Date | null) => {
    console.log(`Date change - ${type}:`, value);

    if(!value) {
      setFilters(prev => ({ ...prev, [type]: null }));
      return;
    }

    // Prevent future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    if(selectedDate > today) {
      console.log('Future date selected - ignoring');
      return;
    }

    // Ensure end date is not before start date
    if(type === 'endDate' && filters.startDate && selectedDate < filters.startDate) {
      console.log('End date before start date - ignoring');
      return;
    }

    setFilters(prev => ({ ...prev, [type]: selectedDate }));
  };

  const isEndDateDisabled = !filters.startDate;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt with username:', username);
    setAuthError('');
    setAuthLoading(true);

    if(username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      console.log('Login successful');
      setIsAuthenticated(true);
    } else {
      console.log('Login failed');
      setAuthError('Invalid credentials');
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if(!isLoggedIn) {
      console.log('User not logged in - redirecting');
      router.push('/');
      return;
    }
    if(isAuthenticated) {
      console.log('User authenticated - fetching analytics');
      fetchAnalytics();
    }
  }, [isLoggedIn, isAuthenticated, router]);

  const fetchAnalytics = async () => {
    console.log('Fetching analytics data');
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics');
      }

      console.log('Analytics data received:', data);
      setAnalytics(data);
      setFilteredAnalytics(applyFilters(data));
    } catch(err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    if(analytics) {
      console.log('Filters changed - reapplying');
      setFilteredAnalytics(applyFilters(analytics));
    }
  }, [filters, analytics, applyFilters]);

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

  if(!filteredAnalytics) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          No data available
        </Typography>
      </Container>
    );
  }

  // Prepare chart data using filtered analytics
  const sourceChartData = {
    labels: filteredAnalytics.topSources.map(item => item.source || 'Direct'),
    datasets: [
      {
        label: 'Visitors by Source',
        data: filteredAnalytics.topSources.map(item => item.count),
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
    labels: filteredAnalytics.topCampaigns.map(item => item.campaign || 'No Campaign'),
    datasets: [
      {
        label: 'Visitors by Campaign',
        data: filteredAnalytics.topCampaigns.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const mediumChartData = {
    labels: filteredAnalytics.topMediums.map(item => item.medium || 'None'),
    datasets: [
      {
        label: 'Visitors by Medium',
        data: filteredAnalytics.topMediums.map(item => item.count),
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
    labels: filteredAnalytics.dailyVisitors.map(item => item.date),
    datasets: [
      {
        label: 'Daily Visitors',
        data: filteredAnalytics.dailyVisitors.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const verificationTrendData = {
    labels: filteredAnalytics.verificationTrend.map(item => item.date),
    datasets: [
      {
        label: 'Verified Users',
        data: filteredAnalytics.verificationTrend.map(item => item.verified),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Total Visitors',
        data: filteredAnalytics.verificationTrend.map(item => item.total),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Traffic Data
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            {/* Source filter */}
            <TextField
              label="Filter by Source"
              value={filters.source}
              onChange={(e) => handleFilterChange('source', e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.source && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClearFilter('source')} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Medium filter */}
            <TextField
              label="Filter by Medium"
              value={filters.medium}
              onChange={(e) => handleFilterChange('medium', e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.medium && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClearFilter('medium')} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Campaign filter */}
            <TextField
              label="Filter by Campaign"
              value={filters.campaign}
              onChange={(e) => handleFilterChange('campaign', e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: filters.campaign && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleClearFilter('campaign')} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Date range pickers */}
            <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, display: 'flex', gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(newValue) => handleDateChange('startDate', newValue)}
                maxDate={filters.endDate || new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      endAdornment: filters.startDate && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleDateChange('startDate', null)} size="small">
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(newValue) => handleDateChange('endDate', newValue)}
                minDate={filters.startDate || undefined}
                maxDate={new Date()}
                disabled={isEndDateDisabled}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      endAdornment: filters.endDate && (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleDateChange('endDate', null)} size="small">
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </Card>

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
              {filteredAnalytics.totalVisitors.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Visitors
            </Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {filteredAnalytics.verifiedUsers.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verified Users
            </Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {filteredAnalytics.conversionRate.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conversion Rate
            </Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {filteredAnalytics.topSources.length}
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
    </LocalizationProvider>
  );
}