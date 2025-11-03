'use client';

export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificateImage = async (data: CertificateData): Promise<string> => {
  try {
    console.log('Starting Image generation for:', data.studentName);

    // Dynamically import html2canvas only on client side
    const html2canvas = (await import('html2canvas')).default;

    // Fetch the HTML template
    const response = await fetch('/certi.html');
    if(!response.ok) {
      throw new Error('Failed to load HTML template');
    }

    let htmlContent = await response.text();

    // Replace placeholders with actual data
    htmlContent = htmlContent
      .replace('{{Your Name here}}', data.studentName)
      .replace('{{Subject Name here}}', data.subjectName);

    console.log('✅ Placeholders replaced successfully');

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    document.body.appendChild(container);

    console.log('⏳ Loading resources...');

    // Wait for fonts
    await document.fonts.ready;

    // Preload the background image
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('✅ Background image loaded');
        resolve();
      };
      img.onerror = () => {
        console.error('❌ Failed to load background image');
        reject(new Error('Background image failed to load'));
      };
      img.src = '/certiBg.jpg';
    });

    // Wait for all other images in the document
    const images = container.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if(img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    );

    // Additional stabilization time
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('🖼️ Generating image...');

    // Generate image using html2canvas
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      imageTimeout: 0,
      width: 1100,
      height: 800,
    });

    // Convert canvas to JPEG base64
    const imageBase64 = canvas.toDataURL('image/jpeg', 1.0).split(',')[1];

    console.log('✅ Image generated successfully, length:', imageBase64.length);

    // Clean up
    document.body.removeChild(container);

    // Verify image is not empty
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
