import { getSession } from 'next-auth/react';

export async function isAuthenticated(req) {
  const session = await getSession({ req });
  return !!session;
}

export async function requireAuth(req, res, next) {
  const authenticated = await isAuthenticated(req);
  
  if (!authenticated) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  next();
}

export function getAuthToken() {
  return process.env.NEXT_PUBLIC_AUTH_TOKEN;
}

export function validatePassword(password) {
  return password === process.env.NEXT_PUBLIC_PASSWORD;
} 