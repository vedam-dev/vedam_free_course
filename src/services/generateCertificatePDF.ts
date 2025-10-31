import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

import puppeteer from 'puppeteer';

export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

export const generateCertificatePDF = async (data: CertificateData): Promise<Buffer> => {
  let browser;
  try {
    console.log('Starting PDF generation for:', data.studentName);

    // Try multiple possible locations for the HTML file
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'certi.html'),
      path.join(process.cwd(), 'certi.html'),
      path.join(process.cwd(), 'src', 'templates', 'certi.html'),
      path.join(process.cwd(), 'src', 'app', 'certi.html'),
    ];

    let htmlContent: string | null = null;

    for(const htmlPath of possiblePaths) {
      console.log('Checking path:', htmlPath);
      if(fs.existsSync(htmlPath)) {
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
        console.log('✅ Found HTML template at:', htmlPath);
        break;
      }
    }

    if(!htmlContent) {
      console.error('❌ HTML template not found. Checked paths:', possiblePaths);
      throw new Error(`HTML template not found. Checked paths: ${possiblePaths.join(', ')}`);
    }

    // Replace placeholders with actual data
    htmlContent = htmlContent
      .replace('{{Your Name here}}', data.studentName)
      .replace('{{Subject Name here }}', data.subjectName);

    console.log('✅ Placeholders replaced successfully');

    // Handle the background image path - convert relative path to absolute URL
    const publicUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    htmlContent = htmlContent.replace(
      /background-image: url\('\.\/certiBg\.jpg'\);/g,
      `background-image: url('${publicUrl}/certiBg.jpg');`
    );

    console.log('✅ Background image path updated');

    // Launch Puppeteer
    console.log('🚀 Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    console.log('✅ New page created');

    // Set viewport to match certificate dimensions
    await page.setViewport({
      width: 1100,
      height: 800
    });

    // Set the HTML content
    console.log('📝 Setting HTML content...');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts to load
    console.log('⏳ Waiting for fonts to load...');
    await page.evaluateHandle('document.fonts.ready');
    // Generate PDF
    console.log('📄 Generating PDF...');
    const rawPdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      timeout: 30000
    });

    const pdfBuffer = Buffer.from(rawPdf);

    console.log('✅ PDF generated successfully, buffer length:', pdfBuffer.length);
    return pdfBuffer;
    return pdfBuffer;

  } catch(error) {
    console.error('❌ Error generating PDF:', error);
    throw new Error(`Failed to generate certificate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if(browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
};