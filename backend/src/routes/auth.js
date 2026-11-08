import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';
import { Batch } from '../models/resources.js';
import { Session } from '../models/Session.js';
import { authenticate } from '../middleware/authenticate.js';
import { cookieClearOptions, cookieOptions, createSession, hashSessionToken, sessionCookieName } from '../security.js';
import { emailSettingsSchema, loginSchema, registrationSchema } from '../validation.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts. Try again later.' } },
});
const DUMMY_PASSWORD_HASH = '$2a$12$I80HRfwrqbeXOrrHOdaqA.4xuMfE17xaWp0kOHqWUEhvrq2Qs5Vby';

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    emailReminders: Boolean(user.emailReminders),
    batch: user.batch || '',
  };
}

router.post('/register', loginLimiter, async (req, res, next) => {
  try {
    const input = registrationSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({ name: input.name, email: input.email, passwordHash, role: 'Student' });
    const emailSender = req.app.locals.emailSender;
    let confirmationEmailSent = false;
    let message = 'Account created, but the confirmation email was not sent because email service is not configured.';
    if (emailSender) {
      try {
        await emailSender.sendAccountCreated({ email: user.email, name: user.name, role: user.role });
        confirmationEmailSent = true;
        message = 'Account created successfully. A confirmation email was sent to your email address.';
      } catch (emailError) {
        req.app.locals.logger?.warn?.('Account confirmation email failed.', { error: emailError.message });
        message = 'Account created, but the confirmation email could not be sent. Please check the email service configuration.';
      }
    }
    res.status(201).json({ data: publicUser(user), meta: { confirmationEmailSent, message } });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await User.findOne({ email: input.email }).select('+passwordHash');
    const passwordMatches = await bcrypt.compare(input.password, user?.passwordHash || DUMMY_PASSWORD_HASH);

    if (!user || !user.active || !passwordMatches) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' } });
    }

    const token = await createSession(user._id);
    res.cookie(sessionCookieName(process.env.NODE_ENV === 'production'), token, cookieOptions(process.env.NODE_ENV === 'production'));
    return res.json({ data: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ data: publicUser(req.auth.user) });
});

router.put('/email-settings', authenticate, async (req, res, next) => {
  try {
    if (!['Lecturer', 'Student'].includes(req.auth.user.role)) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Email lecture reminders are available to lecturers and students.' } });
    }
    const input = emailSettingsSchema.parse(req.body);

    let batch = '';
    if (req.auth.user.role === 'Student') {
      batch = input.batch?.trim() || req.auth.user.batch || '';
      if (input.emailReminders && !batch) {
        return res.status(400).json({ error: { code: 'BATCH_REQUIRED', message: 'Choose your batch before enabling lecture reminders.' } });
      }
      if (batch && !await Batch.exists({ name: batch })) {
        return res.status(400).json({ error: { code: 'INVALID_BATCH', message: 'Choose a batch from the available list.' } });
      }
    }

    const user = await User.findByIdAndUpdate(req.auth.user._id, {
      $set: {
        emailReminders: input.emailReminders,
        batch,
      },
    }, { new: true, runValidators: true });
    return res.json({ data: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await Session.deleteOne({ _id: req.auth.session._id });
    res.clearCookie(sessionCookieName(process.env.NODE_ENV === 'production'), cookieClearOptions(process.env.NODE_ENV === 'production'));
    return res.json({ data: { ok: true } });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout-all', authenticate, async (req, res, next) => {
  try {
    await Session.deleteMany({ user: req.auth.user._id });
    res.clearCookie(sessionCookieName(process.env.NODE_ENV === 'production'), cookieClearOptions(process.env.NODE_ENV === 'production'));
    return res.json({ data: { ok: true } });
  } catch (error) {
    return next(error);
  }
});

export default router;
