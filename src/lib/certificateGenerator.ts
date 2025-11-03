// lib/certificateGenerator.ts or utils/certificateGenerator.ts
'use client';

export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificatePDF = async (data: CertificateData): Promise<string> => {
  try {
    console.log('Starting PDF generation for:', data.studentName);

    // Dynamically import html2pdf only on client side
    const html2pdf = (await import('html2pdf.js')).default;

    // Fetch the HTML template
    const response = await fetch('/certi.html');
    if(!response.ok) {
      throw new Error('Failed to load HTML template');
    }

    let htmlContent = await response.text();

    // Replace placeholders with actual data
    htmlContent = htmlContent
      .replace('{{Your Name here}}', data.studentName)
      .replace('{{Subject Name here }}', data.subjectName);

    console.log('✅ Placeholders replaced successfully');

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
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
      Array.from(images).map(img => {
        if(img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Additional stabilization time
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📄 Generating PDF...');

    // Generate PDF
    const worker = html2pdf();

    const pdfBlob: Blob = await worker
      .set({
        margin: 0,
        filename: `Certificate_${data.studentName}.pdf`,
        image: {
          type: 'jpeg',
          quality: 1
        },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          letterRendering: true,
          imageTimeout: 0
        },
        jsPDF: {
          unit: 'px',
          format: [1100, 800],
          orientation: 'landscape'
        }
      })
      .from(container)
      .toPdf()
      .output('blob');

    console.log('✅ PDF generated successfully, size:', pdfBlob.size, 'bytes');

    // Clean up
    document.body.removeChild(container);

    // Verify PDF is not empty
    if(pdfBlob.size < 1000) {
      throw new Error('Generated PDF appears to be empty or corrupted');
    }

    // Convert blob to base64
    const pdfBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(pdfBlob);
    });

    console.log('✅ PDF converted to base64');
    return pdfBase64;

  } catch(error) {
    console.error('❌ Error generating PDF:', error);
    throw new Error(`Failed to generate certificate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};