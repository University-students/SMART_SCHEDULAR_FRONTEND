import mongoose from 'mongoose';
import { getConfig } from './config.js';
import { createApp } from './app.js';
import { Session } from './models/Session.js';
import { ReminderDelivery } from './models/ReminderDelivery.js';
import { User } from './models/User.js';
import {
  Announcement, Availability, Batch, CalendarPeriod, Course, Lecturer, Lecture, Room, ScheduleLock,
} from './models/resources.js';
import { createEmailSender } from './email.js';
import { createReminderScheduler } from './reminders.js';

try {
  const config = getConfig();
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
    autoIndex: config.NODE_ENV !== 'production',
  });
  await Promise.all([
    Session, ReminderDelivery, User, Announcement, Availability, Batch, CalendarPeriod, Course, Lecturer, Lecture, Room, ScheduleLock,
  ].map(model => model.createIndexes()));
  await ScheduleLock.updateOne({ _id: 'schedule' }, { $setOnInsert: { revision: 0 } }, { upsert: true });
  const emailSender = createEmailSender(config.email);
  const reminderScheduler = createReminderScheduler(config.email, { send: emailSender?.sendLectureReminder });
  reminderScheduler.start();
  if (config.email.enabled) {
    console.info('Email notifications enabled for timetable updates, account creation, and opted-in lecture reminders.');
  } else {
    console.info('Email notifications are disabled; configure SMTP settings to enable them.');
  }
  const server = createApp(config, { emailSender }).listen(config.PORT, () => {
    console.info(`UniSchedule API listening on port ${config.PORT}`);
  });

  async function shutdown(signal) {
    console.info(`Received ${signal}; closing API server.`);
    reminderScheduler.stop();
    server.close(async error => {
      if (error) {
        console.error('Could not close the API server cleanly.', error);
        process.exitCode = 1;
      }
      await mongoose.disconnect();
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
} catch (error) {
  const errorName = error instanceof Error ? error.name : 'UnknownError';
  const errorCode = typeof error?.code === 'number' ? ` (MongoDB code ${error.code})` : '';
  if (error?.code === 18 || error?.codeName === 'AuthenticationFailed') {
    console.error('Could not authenticate with MongoDB Atlas. Check the database username and password in backend/.env; URL-encode special characters in the password.');
  } else if (errorName === 'MongoServerSelectionError' || errorName === 'MongooseServerSelectionError') {
    console.error('Could not reach MongoDB Atlas. Check the cluster host, Atlas IP access list, outbound network access, and that the cluster is running.');
  } else {
    console.error(`Could not start the API (${errorName}${errorCode}). Check backend/.env and the MongoDB Atlas configuration.`);
  }
  process.exitCode = 1;
}
