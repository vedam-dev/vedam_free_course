'use client';

export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificateImage = async (data: CertificateData): Promise<string> => {
  try {
    console.log('Starting Image generation for:', data.studentName);

    const html2canvas = (await import('html2canvas')).default;

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
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '1100px';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    iframe.style.margin = '0';
    iframe.style.padding = '0';

    document.body.appendChild(iframe);

    // Add CSS to reset iframe document styles
    const styleReset = `
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden;
          width: 1100px;
          height: 800px;
        }
      </style>
    `;

    // Write the HTML content to the iframe with style reset
    iframe.contentDocument?.write(styleReset + htmlContent);
    iframe.contentDocument?.close();

    const iframeBody = iframe.contentDocument?.body;
    if(!iframeBody) {
      throw new Error('Failed to create iframe content');
    }

    // Ensure iframe body has no margins/padding
    iframeBody.style.margin = '0';
    iframeBody.style.padding = '0';
    iframeBody.style.overflow = 'hidden';

    console.log('⏳ Loading resources...');

    // Wait for iframe to load completely
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      setTimeout(resolve, 1000);
    });

    // Additional wait for iframe content to render
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('🖼️ Generating image...');

    const canvas = await html2canvas(iframeBody, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: true, // Enable logging to debug
      imageTimeout: 0,
      width: 1100,
      height: 800,
      x: 0, // Explicitly set capture position
      y: 0,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1100,
      windowHeight: 800
    });

    const imageBase64 = canvas.toDataURL('image/jpeg', 1.0).split(',')[1];

    console.log('✅ Image generated successfully, length:', imageBase64.length);

    // Clean up iframe
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