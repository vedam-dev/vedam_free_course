'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface User {
  id: number
  name: string
  email: string
  mobile: string
  created_at: string
}

interface StudentProgress extends User {
  completedVideos: number
  totalVideos: number
  completionPercentage: number
  lastCompletionDate?: string
  status: 'Completed' | 'In Progress' | 'Not Started'
}

interface CompletionStats {
  totalStudents: number
  completedStudents: number
  completionPercentage: number
}

interface RootState {
  user: {
    isLoggedIn: boolean;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [users, setUsers] = useState<User[]>([]);
  const [allStudentsProgress, setAllStudentsProgress] = useState<StudentProgress[]>([]);
  const [completionStats, setCompletionStats] = useState<CompletionStats>({
    totalStudents: 0,
    completedStudents: 0,
    completionPercentage: 0
  });
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);

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
      fetchUsers();
      fetchCompletedStudents();
      fetchAllStudentsProgress();
    }
  }, [isLoggedIn, isAuthenticated, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      setUsers(result.data);
    } catch(error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedStudents = async () => {
    try {
      const response = await fetch('/api/admin/completed-students');
      const result = await response.json();

      if(result.data) {
        setCompletionStats(result.data.completionStats);
        setTotalVideos(result.data.totalVideos);
      }
    } catch(error) {
      console.error('Error fetching completed students:', error);
    }
  };

  const fetchAllStudentsProgress = async () => {
    try {
      setProgressLoading(true);
      const response = await fetch('/api/admin/all-students-progress');
      const result = await response.json();

      if(result.data) {
        setAllStudentsProgress(result.data.students);
      }
    } catch(error) {
      console.error('Error fetching all students progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  if(!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Admin Dashboard Login
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
        '& > *': { flex: '1 1 200px', minWidth: '200px' }
      }}>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            {completionStats.totalStudents}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Students
          </Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            {completionStats.completedStudents}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completed All Videos
          </Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="info.main">
            {totalVideos}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Videos
          </Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">
            {completionStats.completionPercentage}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completion Rate
          </Typography>
        </Card>
      </Box>

      {/* All Students Progress Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          All Students Progress Status
        </Typography>

        {progressLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Completion %</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allStudentsProgress.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No students found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  allStudentsProgress.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.mobile}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${student.completedVideos}/${student.totalVideos}`}
                          color={student.completedVideos === student.totalVideos ? 'success' :
                            student.completedVideos > 0 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={
                          student.completionPercentage === 100 ? 'success.main' :
                            student.completionPercentage > 0 ? 'warning.main' : 'text.secondary'
                        }>
                          {student.completionPercentage}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {student.lastCompletionDate
                          ? new Date(student.lastCompletionDate).toLocaleDateString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={student.status === 'Completed' ? 'success' :
                            student.status === 'In Progress' ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* All Users Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          All Registered Users
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}