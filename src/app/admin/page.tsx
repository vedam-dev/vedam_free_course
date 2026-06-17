'use client';

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

import LogoutButton from '@/components/LogoutButton';

interface User {
  id: number
  name: string
  email: string
  mobile: string
  passout_year?: number | string
  stream?: string
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
  user: { isLoggedIn: boolean };
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
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  useEffect(() => {
    if(!isLoggedIn) {
      router.push('/');
      return;
    }
    fetchUsers();
    fetchTopics();
    fetchCompletedStudents();
    fetchAllStudentsProgress();
  }, [isLoggedIn, router]);

  useEffect(() => {
    if(selectedTopic === 'all') {
      fetchCompletedStudents();
      fetchAllStudentsProgress();
    } else {
      fetchTopicProgress(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const result = await res.json();
      setUsers(result.data);
    } catch(error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedStudents = async () => {
    try {
      const res = await fetch('/api/admin/completed-students');
      const result = await res.json();
      if(result.data) {
        setCompletionStats(result.data.completionStats);
        setTotalVideos(result.data.totalVideos);
      }
    } catch(error) {
      console.error('Error fetching completed students:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/admin/topics');
      const result = await res.json();
      if(result.data?.topics) setTopics(result.data.topics);
    } catch(error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchTopicProgress = async (topic: string) => {
    try {
      setProgressLoading(true);
      const res = await fetch(`/api/admin/topic-progress?topic=${encodeURIComponent(topic)}`);
      const result = await res.json();
      if(result.data) {
        setAllStudentsProgress(result.data.students);
        setCompletionStats(result.data.completionStats);
        setTotalVideos(result.data.totalVideos);
      }
    } catch(error) {
      console.error('Error fetching topic progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  const fetchAllStudentsProgress = async () => {
    try {
      setProgressLoading(true);
      const res = await fetch('/api/admin/all-students-progress');
      const result = await res.json();
      if(result.data) {
        setAllStudentsProgress(result.data.students);
        const completedCount = result.data.students.filter(
          (s: StudentProgress) => s.completionPercentage === 100
        ).length;
        const totalStudents = result.data.totalStudents || result.data.students.length || 0;
        setCompletionStats({
          totalStudents,
          completedStudents: completedCount,
          completionPercentage: totalStudents > 0
            ? Math.round((completedCount / totalStudents) * 100) : 0
        });
        setTotalVideos(result.data.totalVideos);
      }
    } catch(error) {
      console.error('Error fetching all students progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel id="topic-filter-label">Filter by Topic</InputLabel>
            <Select
              labelId="topic-filter-label"
              value={selectedTopic}
              label="Filter by Topic"
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <MenuItem value="all">All Topics</MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>{topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <LogoutButton />
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, '& > *': { flex: '1 1 200px', minWidth: '200px' } }}>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">{completionStats.totalStudents}</Typography>
          <Typography variant="body2" color="text.secondary">Total Students</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">{completionStats.completedStudents}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedTopic === 'all' ? 'Completed All Videos' : `Completed ${selectedTopic}`}
          </Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="info.main">{totalVideos}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedTopic === 'all' ? 'Total Videos' : `Videos in ${selectedTopic}`}
          </Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="warning.main">{completionStats.completionPercentage}%</Typography>
          <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
        </Card>
      </Box>

      {/* Students Progress */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>All Students Progress Status</Typography>
        {progressLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {['S.No', 'Name', 'Email', 'Mobile', 'Year of Passout', 'Stream', 'Progress', 'Completion %', 'Last Activity', 'Status'].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allStudentsProgress.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No students found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  allStudentsProgress.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.mobile}</TableCell>
                      <TableCell>{student.passout_year || 'N/A'}</TableCell>
                      <TableCell>{student.stream || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${student.completedVideos}/${student.totalVideos}`}
                          color={student.completedVideos === student.totalVideos ? 'success' : student.completedVideos > 0 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={
                          student.completionPercentage === 100 ? 'success.main' : student.completionPercentage > 0 ? 'warning.main' : 'text.secondary'
                        }>
                          {student.completionPercentage}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {student.lastCompletionDate ? new Date(student.lastCompletionDate).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={student.status === 'Completed' ? 'success' : student.status === 'In Progress' ? 'warning' : 'default'}
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

      {/* All Users */}
      <Box>
        <Typography variant="h5" gutterBottom>All Registered Users</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['ID', 'Name', 'Email', 'Mobile', 'Year of Passout', 'Stream', 'Created At'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.passout_year || 'N/A'}</TableCell>
                  <TableCell>{user.stream || 'N/A'}</TableCell>
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