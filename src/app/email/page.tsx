'use client';
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label>
        To:
        <input
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          required
          placeholder="recipient@example.com"
          style={{ width: '100%', padding: 6, marginTop: 2 }}
        />
      </label>
      <label>
        Subject:
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          placeholder="Subject"
          style={{ width: '100%', padding: 6, marginTop: 2 }}
        />
      </label>
      <label>
        Message:
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          placeholder="Type your message here..."
          rows={6}
          style={{ width: '100%', padding: 6, marginTop: 2 }}
        />
      </label>
      <button type="submit" disabled={isLoading} style={{ padding: 8, marginTop: 8 }}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
};


export default SendEmailForm;

