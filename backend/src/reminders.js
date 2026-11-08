import { createHash } from 'node:crypto';
import { ReminderDelivery } from './models/ReminderDelivery.js';
import { User } from './models/User.js';
import { Lecture } from './models/resources.js';
import { createEmailSender, getReminderClock, isLectureReminderDue } from './email.js';

function normalizeName(value) {
  return value.trim().toLocaleLowerCase();
}

function isDuplicateKey(error) {
  return error?.code === 11000;
}

export function createReminderScheduler(config, dependencies = {}) {
  const models = dependencies.models || { Lecture, User, ReminderDelivery };
  const send = dependencies.send || createEmailSender(config)?.sendLectureReminder;
  const now = dependencies.now || (() => new Date());
  const logger = dependencies.logger || console;
  let interval;
  let running = false;

  async function sendOnce(lecture, recipient, clock) {
    const deliveryId = createHash('sha256')
      .update(`${clock.date}|${lecture._id}|${recipient.email}`)
      .digest('hex');
    let claim;
    try {
      claim = await models.ReminderDelivery.updateOne(
        {
          _id: deliveryId,
          $or: [
            { status: { $exists: false } },
            { status: 'failed', attempts: { $lt: 3 } },
          ],
        },
        { $set: { status: 'sending' }, $inc: { attempts: 1 } },
        { upsert: true },
      );
    } catch (error) {
      if (isDuplicateKey(error)) return;
      throw error;
    }
    if (!claim.upsertedCount && !claim.modifiedCount) return;

    try {
      await send({ email: recipient.email, lecture, date: clock.date });
      await models.ReminderDelivery.updateOne({ _id: deliveryId }, { $set: { status: 'sent', sentAt: now() } });
    } catch (error) {
      await models.ReminderDelivery.updateOne({ _id: deliveryId }, {
        $set: { status: 'failed', failedAt: now(), failureMessage: error.message.slice(0, 200) },
      });
      logger.warn('Email lecture reminder failed.', { lectureId: String(lecture._id), error: error.message });
    }
  }

  async function runTick() {
    if (!send || running) return;
    running = true;
    try {
      const clock = getReminderClock(now(), config.timezone);
      if (clock.dayIndex < 0) return;

      const [lectures, recipients] = await Promise.all([
        models.Lecture.find({ day: clock.dayIndex }).lean(),
        models.User.find({
          active: true,
          emailReminders: true,
          role: { $in: ['Lecturer', 'Student'] },
        }).lean(),
      ]);
      const dueLectures = lectures.filter(lecture => isLectureReminderDue(lecture, clock));

      for (const lecture of dueLectures) {
        const lecturerName = normalizeName(lecture.lecturer);
        const matchingRecipients = recipients.filter(recipient => (
          (recipient.role === 'Lecturer' && normalizeName(recipient.name) === lecturerName) ||
          (recipient.role === 'Student' && recipient.batch === lecture.batch)
        ));
        for (const recipient of matchingRecipients) await sendOnce(lecture, recipient, clock);
      }
    } catch (error) {
      logger.error('Email reminder scheduler failed.', error);
    } finally {
      running = false;
    }
  }

  return {
    start() {
      if (!send || interval) return;
      void runTick();
      interval = setInterval(() => { void runTick(); }, 20_000);
      interval.unref?.();
    },
    stop() {
      clearInterval(interval);
      interval = undefined;
    },
    runTick,
  };
}