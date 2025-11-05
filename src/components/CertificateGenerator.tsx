'use client';

import { useEffect, useRef } from 'react';

import { generateCertificateImage } from '@/lib/certificateGenerator';

interface CertificateGeneratorProps {
  studentName: string;
  subjectName: string;
  studentEmail: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const CertificateGenerator = ({
  studentName,
  subjectName,
  studentEmail,
  onComplete,
  onError
}: CertificateGeneratorProps) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if(hasRunRef.current) return;
    hasRunRef.current = true;

    const generateAndSend = async () => {
      try {
        console.log('🎓 Generating certificate image for:', studentName);

        // Generate the certificate image (client-side using html2canvas)
        const jpgBase64 = await generateCertificateImage({
          studentName,
          subjectName,
          studentEmail
        });

        console.log('📧 Sending certificate email...');

        // Send to API with the generated image
        const response = await fetch('/api/send-certificate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentName,
            subjectName,
            studentEmail,
            jpgBase64
          }),
        });

        if(!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send certificate');
        }

        console.log('✅ Certificate sent successfully!');
        onComplete?.();

      } catch(err) {
        console.error('❌ Error in certificate generation:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        onError?.(errorMessage);
      }
    };

    generateAndSend();
  }, [studentName, subjectName, studentEmail]);

  return null;
};