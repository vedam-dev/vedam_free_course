/**
 * OTP verification utilities
 * Generates and validates the signed session token after MSG91 verification.
 */

export function generateVerificationToken(mobile: string): string {
  const timestamp = Date.now();
  const payload = `${mobile}:${timestamp}`;
  return Buffer.from(payload).toString('base64');
}

export function verifyVerificationToken(
  token: string,
): { mobile: string; timestamp: number } | null {
  try {
    const payload = Buffer.from(token, 'base64').toString('utf-8');
    const [mobile, timestampStr] = payload.split(':');
    const timestamp = Number.parseInt(timestampStr, 10);

    if(!mobile || Number.isNaN(timestamp)) {
      return null;
    }

    const tokenAge = Date.now() - timestamp;
    const maxAge = 10 * 60 * 1000;

    if(tokenAge > maxAge) {
      return null;
    }

    return { mobile, timestamp };
  } catch{
    return null;
  }
}
