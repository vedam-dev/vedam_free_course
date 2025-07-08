'use client';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

type EmailFormProps = {
  onSubmit?: (data: { to: string; subject: string; message: string }) => void;
};

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ to?: string; subject?: string; message?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if(!to) {
      newErrors.to = 'Recipient email is required';
    } else if(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(to)) {
      newErrors.to = 'Invalid email address';
    }
    if(!subject) {
      newErrors.subject = 'Subject is required';
    }
    if(!message) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!validate()) return;
    setSubmitting(true);
    try {
      if(onSubmit) {
        onSubmit({ to, subject, message });
      }
      setTo('');
      setSubject('');
      setMessage('');
      setErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Send Email
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="To"
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.to}
          helperText={errors.to}
        />
        <TextField
          label="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          fullWidth
          margin="normal"
          required
          error={!!errors.subject}
          helperText={errors.subject}
        />
        <TextField
          label="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          minRows={4}
          error={!!errors.message}
          helperText={errors.message}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EmailForm;
