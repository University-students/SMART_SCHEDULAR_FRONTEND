import { createHash, randomBytes } from 'node:crypto';
import { Session } from './models/Session.js';

export const SESSION_COOKIE = 'unischedule_session';
export const SECURE_SESSION_COOKIE = '__Host-unischedule_session';
export const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000;

export function sessionCookieName(isProduction) {
  return isProduction ? SECURE_SESSION_COOKIE : SESSION_COOKIE;
}

export function cookieOptions(isProduction) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_LIFETIME_MS,
  };
}

export function cookieClearOptions(isProduction) {
  const options = cookieOptions(isProduction);
  delete options.maxAge;
  return options;
}

export function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  await Session.create({ tokenHash: hashSessionToken(token), user: userId, expiresAt });
  return token;
}

export function originGuard(allowedOrigins) {
  const allowed = new Set(allowedOrigins);
  return (req, res, next) => {
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();

    const origin = req.get('origin');
    const sameOrigin = origin && origin === `${req.protocol}://${req.get('host')}`;
    if (!origin || (!allowed.has(origin) && !sameOrigin)) {
      return res.status(403).json({ error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Request origin is not allowed.' } });
    }

    return next();
  };
}
