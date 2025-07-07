'use client';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // Redirect to Google sign-in
      await signIn('google', { callbackUrl: '/' });
    } catch{
      setError('Failed to sign in with Google.');
      setLoading(false);
    }
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='60vh' gap={3}>
      <Typography variant='h4' fontWeight={600} gutterBottom>
        Sign in to your account
      </Typography>
      <Button
        variant='contained'
        color='primary'
        startIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        disabled={loading}
        sx={{ minWidth: 220, fontWeight: 500, fontSize: '1rem' }}
      >
        {loading ? <CircularProgress size={24} color='inherit' /> : 'Sign in with Google'}
      </Button>
      {error && (
        <Typography color='error' variant='body2'>
          {error}
        </Typography>
      )}
    </Box>
  );
}
