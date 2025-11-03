'use client';
import { Clear, Email, Message, Person, School, Send, Subject } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

type EmailFormProps = {
  onSubmit?: (data: { to: string; subject: string; message: string }) => Promise<void> | void;
  onSendCertificate?: (data:
    { studentName: string; subjectName: string; studentEmail: string }) => Promise<void> | void;
};

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, onSendCertificate }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [studentName, setStudentName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [mode, setMode] = useState<'email' | 'certificate'>('email');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if(!to) {
      newErrors.to = 'Email is required';
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      newErrors.to = 'Enter a valid email address';
    }

    if(mode === 'email') {
      if(!subject.trim()) {
        newErrors.subject = 'Subject is required';
      }
      if(!message.trim()) {
        newErrors.message = 'Message is required';
      }
    } else {
      if(!studentName.trim()) {
        newErrors.studentName = 'Student name is required';
      }
      if(!subjectName.trim()) {
        newErrors.subjectName = 'Course name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if(!validateForm()) return;

    setSubmitting(true);
    try {
      if(mode === 'email' && onSubmit) {
        await onSubmit({ to, subject, message });
      } else if(mode === 'certificate' && onSendCertificate) {
        await onSendCertificate({ studentName, subjectName, studentEmail: to });
      }
      setSuccess(true);
      clearForm();
      setTimeout(() => setSuccess(false), 5000);
    } catch(error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = () => {
    setTo('');
    setSubject('');
    setMessage('');
    setStudentName('');
    setSubjectName('');
    setErrors({});
  };

  const isFormEmpty = !to || (mode === 'email' ? !subject || !message : !studentName || !subjectName);

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        {mode === 'email' ? 'Send Email' : 'Send Certificate'}
      </Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, newMode) => newMode && setMode(newMode)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="email">Email</ToggleButton>
        <ToggleButton value="certificate">Certificate</ToggleButton>
      </ToggleButtonGroup>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {mode === 'email' ? 'Email sent!' : 'Certificate sent!'}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.to}
          helperText={errors.to}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          placeholder={mode === 'email' ? 'recipient@example.com' : 'student@example.com'}
          disabled={submitting}
        />

        {mode === 'email' ? (
          <>
            <TextField
              label="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.subject}
              helperText={errors.subject}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Subject />
                  </InputAdornment>
                ),
              }}
              disabled={submitting}
            />

            <TextField
              label="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!errors.message}
              helperText={errors.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <Message />
                  </InputAdornment>
                ),
              }}
              disabled={submitting}
            />
          </>
        ) : (
          <>
            <TextField
              label="Student Name"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.studentName}
              helperText={errors.studentName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              disabled={submitting}
            />

            <TextField
              label="Course Name"
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.subjectName}
              helperText={errors.subjectName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <School />
                  </InputAdornment>
                ),
              }}
              disabled={submitting}
            />
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={clearForm}
            disabled={submitting || isFormEmpty}
            startIcon={<Clear />}
          >
            Clear
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <Send />}
          >
            {submitting ? 'Sending...' : mode === 'email' ? 'Send Email' : 'Send Certificate'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default EmailForm;