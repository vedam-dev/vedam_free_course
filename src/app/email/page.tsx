'use client';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import { useEmail } from '../../hooks/useEmail';


const SendEmailForm = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const { sendEmail, isLoading, error } = useEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      await sendEmail({ to, subject, message });
      setSuccess('Email sent successfully!');
      setTo('');
      setSubject('');
      setMessage('');
    } catch(err) {
      console.log(err);
      // error is handled by useEmail
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="To"
        type="email"
        value={to}
        onChange={e => setTo(e.target.value)}
        required
        placeholder="recipient@example.com"
        fullWidth
        margin="normal"
        autoComplete="email"
      />
      <TextField
        label="Subject"
        type="text"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        required
        placeholder="Subject"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        placeholder="Type your message here..."
        multiline
        rows={6}
        fullWidth
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ mt: 1 }}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </Button>
      <Stack spacing={1} sx={{ mt: 1 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Stack>
    </Box>
  );
};

export default SendEmailForm;
