import {
  signUserSession,
  verifyUserSession,
} from '@/lib/jwt';

type UserSession = {
  userId: string;
  mobile: string;
  createdAt: number;
};

export const createUserSession = async (userId: string, mobile: string): Promise<string> => {
  return signUserSession(userId, mobile);
};

export const getUserSession = async (token?: string | null): Promise<UserSession | null> => {
  if(!token) return null;

  const payload = await verifyUserSession(token);
  if(!payload) return null;

  return {
    userId: payload.userId,
    mobile: payload.mobile,
    createdAt: (payload.iat ?? 0) * 1000,
  };
};

export const destroyUserSession = () => {
  // JWT sessions are stateless; logout clears the cookie client-side.
};
