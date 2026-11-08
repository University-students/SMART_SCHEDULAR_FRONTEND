import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { getConfig } from '../src/config.js';
import { User } from '../src/models/User.js';
import { createEmailSender } from '../src/email.js';

const adminSchema = z.object({
  ADMIN_NAME: z.string().trim().min(2).max(100),
  ADMIN_EMAIL: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(12).max(128).refine(value => Buffer.byteLength(value, 'utf8') <= 72),
});

try {
  const config = getConfig();
  const admin = adminSchema.parse(process.env);
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
  });
  await User.createIndexes();
  const existing = await User.exists({ email: admin.ADMIN_EMAIL });
  if (existing) throw new Error('That email is already registered; no account was changed.');
  const passwordHash = await bcrypt.hash(admin.ADMIN_PASSWORD, 12);
  const user = await User.create({
    name: admin.ADMIN_NAME,
    email: admin.ADMIN_EMAIL,
    passwordHash,
    role: 'Administrator',
  });
  console.info(`Administrator account created for ${admin.ADMIN_EMAIL}.`);
  const emailSender = createEmailSender(config.email);
  if (emailSender) {
    try {
      await emailSender.sendAccountCreated({ email: user.email, name: user.name, role: user.role });
      console.info('Account confirmation email sent.');
    } catch (emailError) {
      console.warn(`Account was created, but confirmation email could not be sent: ${emailError.message}`);
    }
  } else {
    console.info('Account confirmation email not sent; SMTP is not configured.');
  }
} catch (error) {
  console.error(`Administrator creation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
