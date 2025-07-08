'use client';
import React, { useState } from 'react';

import CustomButton from './CustomButton';
import Form from './Form';

const Page = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (
    { to, subject, message }: { to: string; subject: string; message: string }
  ) => {
    setAlert(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message }),
      });
      if(res.ok) {
        setAlert({ type: 'success', message: 'Email sent successfully!' });
      } else {
        const data = await res.json();
        setAlert({
          type: 'error',
          message: data.error ?? 'Failed to send email.'
        });
      }
    } catch{
      setAlert({ type: 'error', message: 'Failed to send email.' });
    }
  };

  return (
    <div>
      <CustomButton label="Sign in with Google" />
      {alert && (
        <div
          style={{
            color: alert.type === 'success' ? 'green' : 'red',
            margin: '1em 0',
          }}
        >
          {alert.message}
        </div>
      )}
      <Form onSubmit={handleSubmit} />
    </div>
  );
};

export default Page;
