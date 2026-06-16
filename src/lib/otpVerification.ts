/**
 * OTP Verification utilities
 * Handles verification token generation and validation
 */

/**
 * Generate a verification token to bind the verified phone number
 * This token will be validated when creating the user
 */
export function generateVerificationToken(mobile: string): string {
  const timestamp = Date.now();
  const secret = process.env.NEXT_PUBLIC_MSG91_AUTH_KEY || 'fallback-secret';
  
  // Simple token generation - in production, use a proper signing mechanism
  const payload = `${mobile}:${timestamp}`;
  const token = Buffer.from(payload).toString('base64');
  
  return token;
}

/**
 * Verify the verification token and extract the mobile number
 */
export function verifyVerificationToken(token: string): { mobile: string; timestamp: number } | null {
  try {
    const payload = Buffer.from(token, 'base64').toString('utf-8');
    const [mobile, timestampStr] = payload.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // Token should be valid for 10 minutes
    const tokenAge = Date.now() - timestamp;
    const maxAge = 10 * 60 * 1000; // 10 minutes

    if(tokenAge > maxAge) {
      console.error('Verification token expired');
      return null;
    }

    return { mobile, timestamp };
  } catch(error) {
    console.error('Invalid verification token:', error);
    return null;
  }
}
