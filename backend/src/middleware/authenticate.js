import { sessionCookieName, hashSessionToken } from '../security.js';
import { Session } from '../models/Session.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.[sessionCookieName(process.env.NODE_ENV === 'production')];
    if (!token) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to continue.' } });

    const session = await Session.findOne({
      tokenHash: hashSessionToken(token),
      expiresAt: { $gt: new Date() },
    }).populate({ path: 'user', select: 'name email role emailReminders batch active' });

    if (!session || !session.user?.active) {
      return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in to continue.' } });
    }

    req.auth = { user: session.user, session };
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.auth?.user?.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' } });
    }
    return next();
  };
}
