import { type JWTPayload, jwtVerify, SignJWT } from 'jose';

const ADMIN_SESSION_TTL = '24h';
const USER_SESSION_TTL = '24h';

export type AdminSessionPayload = JWTPayload & {
  type: 'admin';
  username: string;
};

export type UserSessionPayload = JWTPayload & {
  type: 'user';
  userId: string;
  mobile: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if(!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(username: string): Promise<string> {
  return new SignJWT({ type: 'admin', username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ADMIN_SESSION_TTL)
    .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if(payload.type !== 'admin' || typeof payload.username !== 'string') {
      return null;
    }
    return payload as AdminSessionPayload;
  } catch{
    return null;
  }
}

export async function signUserSession(userId: string, mobile: string): Promise<string> {
  return new SignJWT({ type: 'user', userId, mobile })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(USER_SESSION_TTL)
    .sign(getSecretKey());
}

export async function verifyUserSession(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if(
      payload.type !== 'user'
      || typeof payload.userId !== 'string'
      || typeof payload.mobile !== 'string'
    ) {
      return null;
    }
    return payload as UserSessionPayload;
  } catch{
    return null;
  }
}
