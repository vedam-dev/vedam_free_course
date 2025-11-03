'use client';
import React, { useState } from 'react';

import { generateCertificatePDF } from '@/lib/certificateGenerator'; // Adjust path as needed

import EmailForm from './Form';

const Page = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmitEmail =
  async ({ to, subject, message }: { to: string; subject: string; message: string }) => {
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
          message: data.error ?? 'Failed to send email. Please try again.'
        });
      }
    } catch(error) {
      console.error('Email submission error:', error);
      setAlert({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleSendCertificate = async ({ studentName, subjectName, studentEmail }: {
    studentName: string;
    subjectName: string;
    studentEmail: string;
  }) => {
    setAlert(null);
    try {
      // Generate PDF on client side
      console.log('Generating PDF...');
      const pdfBase64 = await generateCertificatePDF({
        studentName,
        subjectName,
        studentEmail
      });

      console.log('Sending certificate to API...');

      // Send to API with PDF data
      const res = await fetch('/api/send-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          subjectName,
          studentEmail,
          pdfBase64
        }),
      });

      if(res.ok) {
        setAlert({ type: 'success', message: 'Certificate sent successfully!' });
      } else {
        const data = await res.json();
        setAlert({
          type: 'error',
          message: data.error ?? 'Failed to send certificate. Please try again.'
        });
      }
    } catch(error) {
      console.error('Certificate submission error:', error);
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to generate certificate. Please try again.'
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '20px' }}>
      {alert && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: alert.type === 'success' ? '#4CAF50' : '#f44336',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: '500'
          }}
        >
          {alert.message}
        </div>
      )}
      <EmailForm
        onSubmit={handleSubmitEmail}
        onSendCertificate={handleSendCertificate}
      />
    </div>
  );
};

export default Page;