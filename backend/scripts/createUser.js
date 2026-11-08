import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { getConfig } from '../src/config.js';
import { User } from '../src/models/User.js';
import { createEmailSender } from '../src/email.js';

const operatorUserSchema = z.object({
  USER_NAME: z.string().trim().min(2).max(100),
  USER_EMAIL: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  USER_PASSWORD: z.string().min(12).max(128).refine(value => Buffer.byteLength(value, 'utf8') <= 72),
  USER_ROLE: z.enum(['Administrator', 'Head of Department', 'Lecturer', 'Student']),
});

try {
  const config = getConfig();
  const input = operatorUserSchema.parse(process.env);
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
  });
  await User.createIndexes();
  const passwordHash = await bcrypt.hash(input.USER_PASSWORD, 12);
  const user = await User.create({
    name: input.USER_NAME,
    email: input.USER_EMAIL,
    passwordHash,
    role: input.USER_ROLE,
  });
  console.info(`Created ${input.USER_ROLE} account for ${input.USER_EMAIL}.`);
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
  console.error(`User creation failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
