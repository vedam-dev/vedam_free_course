export interface CertificateData {
  studentName: string;
  subjectName: string;
  studentEmail: string;
}

// PDF generation has been disabled - Puppeteer removed
export const generateCertificatePDF = async (): Promise<Buffer> => {
  throw new Error('PDF certificate generation is currently disabled. Puppeteer has been removed from the project.');
};