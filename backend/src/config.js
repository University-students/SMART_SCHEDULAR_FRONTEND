import 'dotenv/config';
import { z } from 'zod';

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  MONGODB_URI: z.string({ error: 'MONGODB_URI is required' })
    .min(1, 'MONGODB_URI is required')
    .refine(value => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'), {
      message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://.',
    }),
  MONGODB_DB: z.string().trim().min(1).default('unischedule'),
  WEB_ORIGINS: z.string().default('http://localhost:5173'),
  SMTP_HOST: z.string().trim().default(''),
  SMTP_PORT: z.string().regex(/^\d+$/).default('587').transform(Number).pipe(z.number().int().min(1).max(65535)),
  SMTP_SECURE: z.enum(['true', 'false']).default('false').transform(value => value === 'true'),
  SMTP_USER: z.string().trim().default(''),
  SMTP_PASSWORD: z.string().default(''),
  SMTP_FROM: z.string().trim().default(''),
  EMAIL_TIMEZONE: z.string().trim().min(1).default('Asia/Colombo'),
});

export function getConfig() {
  const parsed = configSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid backend configuration: ${parsed.error.issues.map(issue => issue.message).join('; ')}`);
  }
  if (Boolean(parsed.data.SMTP_USER) !== Boolean(parsed.data.SMTP_PASSWORD)) {
    throw new Error('Invalid backend configuration: set both SMTP_USER and SMTP_PASSWORD, or leave both blank.');
  }
  const smtpConfigured = Boolean(
    parsed.data.SMTP_HOST || parsed.data.SMTP_FROM || parsed.data.SMTP_USER || parsed.data.SMTP_PASSWORD,
  );
  if (smtpConfigured && (!parsed.data.SMTP_HOST || !parsed.data.SMTP_FROM)) {
    throw new Error('Invalid backend configuration: set both SMTP_HOST and SMTP_FROM to enable email reminders.');
  }

  return {
    ...parsed.data,
    allowedOrigins: parsed.data.WEB_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean),
    email: {
      enabled: Boolean(parsed.data.SMTP_HOST && parsed.data.SMTP_FROM),
      host: parsed.data.SMTP_HOST,
      port: parsed.data.SMTP_PORT,
      secure: parsed.data.SMTP_SECURE,
      user: parsed.data.SMTP_USER,
      password: parsed.data.SMTP_PASSWORD,
      from: parsed.data.SMTP_FROM,
      timezone: parsed.data.EMAIL_TIMEZONE,
    },
  };
}
