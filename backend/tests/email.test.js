import assert from 'node:assert/strict';
import test from 'node:test';
import { getConfig } from '../src/config.js';
import { createReminderScheduler } from '../src/reminders.js';
import { emailSettingsSchema } from '../src/validation.js';
import {
  buildLectureReminderEmail,
  createEmailSender,
  buildAccountCreatedEmail,
  buildScheduleUpdateEmail,
  getReminderClock,
  isLectureReminderDue,
} from '../src/email.js';

const emailConfig = {
  enabled: true,
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  user: 'mailer@example.com',
  password: 'test-password',
  from: 'UniSchedule <mailer@example.com>',
  timezone: 'Asia/Colombo',
};

test('SMTP settings enable email only when the server and sender are configured', () => {
  const keys = [
    'MONGODB_URI', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM',
  ];
  const original = new Map(keys.map(key => [key, process.env[key]]));
  try {
    process.env.MONGODB_URI = 'mongodb://localhost/unischedule';
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '465';
    process.env.SMTP_SECURE = 'true';
    process.env.SMTP_USER = 'mailer@example.com';
    process.env.SMTP_PASSWORD = 'test-password';
    process.env.SMTP_FROM = 'mailer@example.com';

    const config = getConfig();
    assert.equal(config.email.enabled, true);
    assert.equal(config.email.port, 465);
    assert.equal(config.email.secure, true);

    delete process.env.SMTP_FROM;
    assert.throws(() => getConfig(), /set both SMTP_HOST and SMTP_FROM/);
  } finally {
    for (const [key, value] of original) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('lecture reminders use the timetable timezone and fire 15 minutes before class', () => {
  const clock = getReminderClock(new Date('2026-11-02T02:15:00.000Z'), 'Asia/Colombo');
  const lecture = { day: 0, start: 8 };

  assert.deepEqual(clock, { dayIndex: 0, date: '2026-11-02', minuteOfDay: 465 });
  assert.equal(isLectureReminderDue(lecture, clock), true);
  assert.equal(isLectureReminderDue({ ...lecture, day: 1 }, clock), false);
  const quarterHourClock = getReminderClock(new Date('2026-11-02T07:45:00.000Z'), 'Asia/Colombo');
  assert.equal(quarterHourClock.minuteOfDay, 795);
  assert.equal(isLectureReminderDue({ day: 0, start: 13.5 }, quarterHourClock), true);
});

test('email reminder contains the timetable details and account email', () => {
  const message = buildLectureReminderEmail({
    email: 'student@example.com',
    date: '2026-11-02',
    lecture: { code: 'ICT 2201', title: 'Web Development', start: 8, room: 'LT 01' },
  }, emailConfig);

  assert.equal(message.from, emailConfig.from);
  assert.equal(message.to, 'student@example.com');
  assert.equal(message.subject, 'Lecture reminder: ICT 2201 - Web Development');
  assert.match(message.text, /Date: 2026-11-02/);
  assert.match(message.text, /Start time: 08:00/);
  assert.match(message.text, /Room: LT 01/);
  const quarterHourMessage = buildLectureReminderEmail({
    email: 'student@example.com',
    date: '2026-11-02',
    lecture: { code: 'ICT', title: 'Class', start: 10.75, room: 'LT 01' },
  }, emailConfig);
  assert.match(quarterHourMessage.text, /Start time: 10:45/);
});

test('account confirmation email confirms account role without disclosing its password', () => {
  const message = buildAccountCreatedEmail({
    email: 'student@example.com',
    name: 'Student Example',
    role: 'Student',
  }, emailConfig);

  assert.equal(message.from, emailConfig.from);
  assert.equal(message.to, 'student@example.com');
  assert.equal(message.subject, 'Your UniSchedule account was created');
  assert.match(message.text, /Student account was created successfully/);
  assert.doesNotMatch(message.text, /password/i);
});

test('timetable update email includes details for each newly added lecture', () => {
  const message = buildScheduleUpdateEmail({
    email: 'student@example.com',
    lectures: [
      { day: 0, start: 8, end: 10, code: 'ICT 2201', title: 'Web Development', lecturer: 'Dr. Example', room: 'LT 01', batch: 'ICT 22' },
      { day: 2, start: 10.75, end: 12, code: 'ICT 2202', title: 'Databases', lecturer: 'Dr. Sample', room: 'LT 02', batch: 'ICT 23' },
    ],
  }, emailConfig);

  assert.equal(message.from, emailConfig.from);
  assert.equal(message.to, 'student@example.com');
  assert.equal(message.subject, 'New lectures added to the timetable');
  assert.match(message.text, /Monday 08:00-10:00: ICT 2201 - Web Development/);
  assert.match(message.text, /Wednesday 10:45-12:00: ICT 2202 - Databases/);
  assert.match(message.text, /Lecturer: Dr. Example/);
  assert.match(message.text, /Room: LT 02/);
  assert.match(message.text, /Batch: ICT 23/);
});

test('email sender configures SMTP and reports provider rejection without exposing credentials', async () => {
  let transportOptions;
  let sentMessage;
  const emailSender = createEmailSender(emailConfig, options => {
    transportOptions = options;
    return { sendMail: async message => { sentMessage = message; } };
  });

  await emailSender.sendLectureReminder({ email: 'student@example.com', date: '2026-11-02', lecture: { code: 'ICT', title: 'Class', start: 8, room: 'LT 01' } });
  assert.deepEqual(transportOptions, {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: { user: 'mailer@example.com', pass: 'test-password' },
  });
  assert.equal(sentMessage.to, 'student@example.com');
  await emailSender.sendAccountCreated({ email: 'student@example.com', name: 'Student Example', role: 'Student' });
  assert.equal(sentMessage.subject, 'Your UniSchedule account was created');
  await emailSender.sendScheduleUpdate({
    email: 'student@example.com',
    lectures: [{ day: 0, start: 8, end: 10, code: 'ICT', title: 'Class', lecturer: 'Dr. Example', room: 'LT 01', batch: 'ICT 22' }],
  });
  assert.equal(sentMessage.subject, 'New timetable lecture: ICT');
  assert.equal(createEmailSender({ enabled: false }), null);

  const rejected = createEmailSender(emailConfig, () => ({
    sendMail: async () => { throw Object.assign(new Error('secret data'), { code: 'EAUTH' }); },
  }));
  await assert.rejects(
    rejected.sendLectureReminder({ email: 'student@example.com', date: '2026-11-02', lecture: { code: 'ICT', title: 'Class', start: 8, room: 'LT 01' } }),
    error => error.message === 'SMTP email delivery failed (EAUTH).',
  );
});

test('email reminder settings require explicit opt-in and a batch for students', () => {
  assert.deepEqual(emailSettingsSchema.parse({ emailReminders: true, batch: 'ICT 22' }), {
    emailReminders: true, batch: 'ICT 22',
  });
  assert.throws(() => emailSettingsSchema.parse({ emailReminders: 'yes' }));
  assert.throws(() => emailSettingsSchema.parse({ emailReminders: true, email: 'other@example.com' }));
});

test('reminder worker claims each lecture and recipient once', async () => {
  const lecture = { _id: 'lecture-1', day: 0, start: 8, lecturer: 'Dr. Example', batch: 'ICT 22', code: 'ICT', title: 'Class', room: 'LT 01' };
  const recipient = { _id: 'user-1', role: 'Lecturer', name: 'Dr. Example', email: 'lecturer@example.com', emailReminders: true, active: true };
  const student = { _id: 'user-2', role: 'Student', name: 'Student Example', email: 'student@example.com', batch: 'ICT 22', emailReminders: true, active: true };
  const deliveries = new Map();
  let sendCount = 0;
  const models = {
    Lecture: { find: () => ({ lean: async () => [lecture] }) },
    User: { find: () => ({ lean: async () => [recipient, student] }) },
    ReminderDelivery: {
      async updateOne(filter, update) {
        if (update.$inc) {
          if (deliveries.has(filter._id)) return { upsertedCount: 0 };
          deliveries.set(filter._id, { ...update.$set, attempts: update.$inc.attempts });
          return { upsertedCount: 1 };
        }
        Object.assign(deliveries.get(filter._id), update.$set);
        return { upsertedCount: 0 };
      },
    },
  };
  const scheduler = createReminderScheduler(emailConfig, {
    models,
    send: async () => { sendCount += 1; },
    now: () => new Date('2026-11-02T02:15:00.000Z'),
    logger: { warn() {}, error() {} },
  });

  await scheduler.runTick();
  await scheduler.runTick();

  assert.equal(sendCount, 2);
  assert.equal([...deliveries.values()].filter(delivery => delivery.status === 'sent').length, 2);
});
