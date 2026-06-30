import {
  signAdminSession,
  verifyAdminSession,
} from '@/lib/jwt';

type AdminSession = {
  username: string;
  createdAt: number;
};

export const createAdminSession = async (username: string): Promise<string> => {
  return signAdminSession(username);
};

export const isAdminSessionValid = async (token?: string | null): Promise<boolean> => {
  if(!token) return false;
  const payload = await verifyAdminSession(token);
  return Boolean(payload);
};

export const destroyAdminSession = () => {
  // JWT sessions are stateless; logout clears the cookie client-side.
};

export const getSession = async (token: string): Promise<AdminSession | null> => {
  const payload = await verifyAdminSession(token);
  if(!payload) return null;

  return {
    username: payload.username,
    createdAt: (payload.iat ?? 0) * 1000,
  };
};
