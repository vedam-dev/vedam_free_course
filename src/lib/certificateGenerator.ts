'use client';

// @ts-expect-error: dom-to-image-more has no types
import * as domtoimage from 'dom-to-image-more';

export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificateImage = async (data: CertificateData): Promise<string> => {
  try {
    console.log('Starting Image generation for:', data.studentName);

    const response = await fetch('/certi.html');
    if(!response.ok) {
      throw new Error('Failed to load HTML template');
    }

    let htmlContent = await response.text();

    htmlContent = htmlContent
      .replace('{{Your Name here}}', data.studentName)
      .replace('{{Subject Name here}}', data.subjectName);

    console.log('✅ Placeholders replaced successfully');

    // Create an iframe with proper styling
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    iframe.style.width = '1100px';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    document.body.appendChild(iframe);


    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if(!iframeDoc) {
      throw new Error('Failed to access iframe document');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    console.log('⏳ Loading resources...');

    await new Promise<void>((resolve) => {
      if(iframe.contentWindow) {
        iframe.contentWindow.addEventListener('load', () => resolve());
      }
      setTimeout(resolve, 1500);
    });


    if(iframe.contentWindow?.document.fonts) {
      await iframe.contentWindow.document.fonts.ready;
      console.log('✅ Fonts loaded');
    }


    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        console.log('✅ Background image loaded');
        resolve();
      };
      img.onerror = () => {
        console.warn('⚠️ Background image failed to load, continuing anyway');
        resolve();
      };
      img.src = '/certiBg.jpg';
      setTimeout(resolve, 2000);
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🖼️ Generating image with dom-to-image...');

    const certificateEl = iframeDoc.querySelector('.certificate') as HTMLElement;

    if(!certificateEl) {
      throw new Error('Certificate element not found in iframe');
    }

    certificateEl.style.transform = 'translateZ(0)';
    certificateEl.style.webkitTransform = 'translateZ(0)';
    const dataUrl = await domtoimage.toPng(certificateEl, {
      width: 1100,
      height: 800,
      quality: 1.0,
      bgcolor: '#ffffff',
      style: {
        margin: '0',
        padding: '0',
        transform: 'scale(1)',
        transformOrigin: 'top left',
        webkitFontSmoothing: 'antialiased',
        mozOsxFontSmoothing: 'grayscale'
      },
      filter: (node: unknown) => {
        if((node as HTMLElement).tagName === 'SCRIPT') return false;
        return true;
      }
    });

    const imageBase64 = dataUrl.split(',')[1];

    console.log('✅ Image generated successfully, length:', imageBase64.length);

    document.body.removeChild(iframe);

    if(imageBase64.length < 1000) {
      throw new Error('Generated image appears to be empty or corrupted');
    }

    console.log('✅ Certificate image ready (base64)');
    return imageBase64;

  } catch(error) {
    console.error('❌ Error generating certificate image:', error);
    throw new Error(
      `Failed to generate certificate image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};