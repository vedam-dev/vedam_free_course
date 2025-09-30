'use client';

import {
  Alert,
  Box,
  Button,
  Card,
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

interface RootState {
  user: {
    isLoggedIn: boolean;
  };
}

export default function AdminPage() {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
        Admin - User Data
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
    </Container>
  );
}