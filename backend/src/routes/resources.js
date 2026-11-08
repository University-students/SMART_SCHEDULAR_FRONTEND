import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../models/User.js';
import {
  Announcement, Availability, Batch, CalendarPeriod, Course, Lecturer, Lecture, Room, ScheduleLock,
} from '../models/resources.js';
import { authenticate, requireRole } from '../middleware/authenticate.js';
import { resourceSchemas } from '../validation.js';
import { hasScheduleConflict } from '../scheduling.js';

const router = Router();
const adminOnly = requireRole('Administrator', 'Head of Department');
const resources = [
  { path: 'classes', model: Lecture },
  { path: 'courses', model: Course },
  { path: 'lecturers', model: Lecturer },
  { path: 'rooms', model: Room },
  { path: 'batches', model: Batch },
  { path: 'availability', model: Availability },
];

function serialize(document) {
  const value = typeof document.toObject === 'function' ? document.toObject() : document;
  const id = String(value._id);
  delete value._id;
  return { ...value, id };
}

async function withScheduleWrite(work) {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      await ScheduleLock.updateOne({ _id: 'schedule' }, { $inc: { revision: 1 } }, { session });
      return work(session);
    });
  } finally {
    await session.endSession();
  }
}

function scheduleConflict(message) {
  const error = new Error(message);
  error.code = 'SCHEDULE_CONFLICT';
  return error;
}

function lectureIdentity(lecture) {
  return JSON.stringify([
    lecture.day,
    lecture.start,
    lecture.end,
    lecture.code,
    lecture.title,
    lecture.lecturer,
    lecture.room,
    lecture.batch,
  ]);
}

async function notifyStudentsOfScheduleUpdate(req, lectures) {
  if (lectures.length === 0) return null;
  const emailSender = req.app.locals.emailSender;
  if (!emailSender?.sendScheduleUpdate) {
    return { enabled: Boolean(emailSender?.sendScheduleUpdate), recipients: 0, sent: 0, failed: 0 };
  }

  try {
    const students = await User.find({ role: 'Student', active: true }).select('email').lean();
    let sent = 0;
    let failed = 0;
    for (let index = 0; index < students.length; index += 10) {
      const batch = students.slice(index, index + 10);
      const results = await Promise.allSettled(batch.map(student => (
        emailSender.sendScheduleUpdate({ email: student.email, lectures })
      )));
      sent += results.filter(result => result.status === 'fulfilled').length;
      failed += results.filter(result => result.status === 'rejected').length;
    }
    if (failed) {
      console.warn('Timetable update notification email delivery failed.', { failed, recipients: students.length });
    }
    return { enabled: true, recipients: students.length, sent, failed };
  } catch (error) {
    console.error('Could not send timetable update notifications.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return { enabled: true, recipients: 0, sent: 0, failed: 0, error: true };
  }
}

router.use(authenticate);

router.get('/calendar-periods', async (req, res, next) => {
  try {
    const periods = await CalendarPeriod.find().sort({ startDate: 1, createdAt: -1 }).limit(1000).lean();
    return res.json({ data: periods.map(serialize) });
  } catch (error) {
    return next(error);
  }
});

router.post('/calendar-periods', adminOnly, async (req, res, next) => {
  try {
    const input = resourceSchemas.calendarPeriod.parse(req.body);
    const [period] = await CalendarPeriod.create([{ ...input, createdBy: req.auth.user.name }]);
    return res.status(201).json({ data: serialize(period) });
  } catch (error) {
    return next(error);
  }
});

router.delete('/calendar-periods/:id', adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'The record ID is invalid.' } });
    }
    const period = await CalendarPeriod.findByIdAndDelete(req.params.id);
    if (!period) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The record was not found.' } });
    return res.json({ data: { id: String(period._id) } });
  } catch (error) {
    return next(error);
  }
});

router.get('/announcements', async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ data: announcements.map(serialize) });
  } catch (error) {
    return next(error);
  }
});

router.post('/announcements', adminOnly, async (req, res, next) => {
  try {
    const input = resourceSchemas.announcement.parse(req.body);
    const [announcement] = await Announcement.create([{ ...input, createdBy: req.auth.user.name }]);
    return res.status(201).json({ data: serialize(announcement) });
  } catch (error) {
    return next(error);
  }
});

router.delete('/announcements/:id', adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: { code: 'INVALID_ID', message: 'The record ID is invalid.' } });
    }
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The record was not found.' } });
    return res.json({ data: { id: String(announcement._id) } });
  } catch (error) {
    return next(error);
  }
});

for (const { path, model } of resources) {
  const schema = resourceSchemas[path];
  const collection = Router();

  collection.get('/', async (req, res, next) => {
    try {
      const documents = await model.find().sort({ createdAt: 1 }).limit(1000).lean();
      res.json({ data: documents.map(serialize) });
    } catch (error) {
      next(error);
    }
  });

  collection.post('/', adminOnly, async (req, res, next) => {
    try {
      const input = schema.parse(req.body);
      let document;
      if (path === 'classes') {
        await withScheduleWrite(async session => {
          if (hasScheduleConflict(await Lecture.find().session(session).lean(), input)) {
            throw scheduleConflict('This lecture conflicts with an existing room, lecturer, or batch booking.');
          }
          [document] = await Lecture.create([input], { session });
        });
      } else {
        document = await model.create(input);
      }
      const emailNotifications = path === 'classes'
        ? await notifyStudentsOfScheduleUpdate(req, [document.toObject()])
        : undefined;
      return res.status(201).json({
        data: serialize(document),
        ...(emailNotifications ? { meta: { emailNotifications } } : {}),
      });
    } catch (error) {
      if (error.code === 'SCHEDULE_CONFLICT') {
        return res.status(409).json({ error: { code: error.code, message: error.message } });
      }
      return next(error);
    }
  });

  if (path !== 'availability') collection.put('/:id', adminOnly, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: { code: 'INVALID_ID', message: 'The record ID is invalid.' } });
      }
      const input = schema.parse(req.body);
      let document;
      if (path === 'classes') {
        await withScheduleWrite(async session => {
          if (hasScheduleConflict(await Lecture.find().session(session).lean(), { ...input, _id: req.params.id })) {
            throw scheduleConflict('This lecture conflicts with an existing room, lecturer, or batch booking.');
          }
          document = await Lecture.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true, session });
        });
      } else {
        document = await model.findByIdAndUpdate(req.params.id, input, { new: true, runValidators: true });
      }
      if (!document) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The record was not found.' } });
      return res.json({ data: serialize(document) });
    } catch (error) {
      if (error.code === 'SCHEDULE_CONFLICT') {
        return res.status(409).json({ error: { code: error.code, message: error.message } });
      }
      return next(error);
    }
  });

  if (path !== 'availability') collection.delete('/:id', adminOnly, async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: { code: 'INVALID_ID', message: 'The record ID is invalid.' } });
      }
      const document = await model.findByIdAndDelete(req.params.id);
      if (!document) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'The record was not found.' } });
      return res.json({ data: { id: String(document._id) } });
    } catch (error) {
      return next(error);
    }
  });

  router.use(`/${path}`, collection);
}

router.put('/schedule/replace', adminOnly, async (req, res, next) => {
  try {
    const input = z.array(resourceSchemas.classes).max(300).parse(req.body?.lectures);
    for (let index = 0; index < input.length; index += 1) {
      if (hasScheduleConflict(input.slice(0, index), input[index])) {
        return res.status(409).json({ error: { code: 'SCHEDULE_CONFLICT', message: `Lecture ${input[index].code} overlaps another room, lecturer, or batch booking.` } });
      }
    }

    const mongoSession = await mongoose.startSession();
    let saved = [];
    let addedLectures = [];
    try {
      await mongoSession.withTransaction(async () => {
        await ScheduleLock.updateOne({ _id: 'schedule' }, { $inc: { revision: 1 } }, { session: mongoSession });
        const existingLectures = await Lecture.find().session(mongoSession).lean();
        const existingIdentities = new Set(existingLectures.map(lectureIdentity));
        addedLectures = input.filter(lecture => !existingIdentities.has(lectureIdentity(lecture)));
        await Lecture.deleteMany({}, { session: mongoSession });
        if (input.length) {
          saved = await Lecture.insertMany(input, { session: mongoSession, ordered: true });
        }
      });
    } finally {
      await mongoSession.endSession();
    }
    const emailNotifications = await notifyStudentsOfScheduleUpdate(req, addedLectures);
    return res.json({ data: saved.map(serialize), meta: { emailNotifications } });
  } catch (error) {
    return next(error);
  }
});

router.put('/availability/:lecturer', requireRole('Administrator', 'Head of Department', 'Lecturer'), async (req, res, next) => {
  try {
    const lecturer = z.string().trim().min(1).max(120).parse(req.params.lecturer);
    if (req.auth.user.role === 'Lecturer' && req.auth.user.name.trim().toLowerCase() !== lecturer.toLowerCase()) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Lecturers can only update their own availability.' } });
    }
    const input = resourceSchemas.availability.parse({ ...req.body, lecturer });
    const document = await Availability.findOneAndUpdate(
      { lecturer },
      { $set: input },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.json({ data: serialize(document) });
  } catch (error) {
    return next(error);
  }
});

export default router;
