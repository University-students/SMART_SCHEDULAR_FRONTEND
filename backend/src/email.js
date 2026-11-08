import nodemailer from 'nodemailer';

export function getReminderClock(date, timezone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(values.weekday);

  return {
    dayIndex,
    date: `${values.year}-${values.month}-${values.day}`,
    minuteOfDay: Number(values.hour) * 60 + Number(values.minute),
  };
}

export function isLectureReminderDue(lecture, clock, leadMinutes = 15) {
  return lecture.day === clock.dayIndex && Math.round(lecture.start * 60) - leadMinutes === clock.minuteOfDay;
}

function formatTime(hour) {
  const minutes = Math.round(hour * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function buildScheduleUpdateEmail({ email, lectures }, config) {
  const lectureDetails = lectures.map(lecture => (
    `${WEEKDAYS[lecture.day]} ${formatTime(lecture.start)}-${formatTime(lecture.end)}: ${lecture.code} - ${lecture.title}\n` +
    `  Lecturer: ${lecture.lecturer}\n  Room: ${lecture.room}\n  Batch: ${lecture.batch}`
  ));
  return {
    from: config.from,
    to: email,
    subject: lectures.length === 1 ? `New timetable lecture: ${lectures[0].code}` : 'New lectures added to the timetable',
    text: [
      'New lecture information has been added to the UniSchedule timetable.',
      '',
      ...lectureDetails.flatMap((details, index) => index ? ['', details] : [details]),
      '',
      'Please sign in to UniSchedule to view the timetable.',
    ].join('\n'),
  };
}

export function buildLectureReminderEmail({ email, lecture, date }, config) {
  return {
    from: config.from,
    to: email,
    subject: `Lecture reminder: ${lecture.code} - ${lecture.title}`,
    text: [
      'Your lecture starts in 15 minutes.',
      '',
      `Course: ${lecture.code}`,
      `Lecture: ${lecture.title}`,
      `Date: ${date}`,
      `Start time: ${formatTime(lecture.start)}`,
      `Room: ${lecture.room}`,
    ].join('\n'),
  };
}

export function buildAccountCreatedEmail({ email, name, role }, config) {
  return {
    from: config.from,
    to: email,
    subject: 'Your UniSchedule account was created',
    text: [
      `Hello ${name},`,
      '',
      `Your UniSchedule ${role} account was created successfully.`,
      `Sign in with this email address: ${email}`,
      '',
      'If you did not expect this account, contact your university administrator.',
    ].join('\n'),
  };
}

function providerError(error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_-]{1,40}$/i.test(error.code)
    ? ` (${error.code})`
    : '';
  return new Error(`SMTP email delivery failed${code}.`);
}

export function createEmailSender(config, createTransport = nodemailer.createTransport) {
  if (!config?.enabled) return null;

  const transport = createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    ...(config.user ? { auth: { user: config.user, pass: config.password } } : {}),
  });

  const send = async message => {
    try {
      await transport.sendMail(message);
    } catch (error) {
      throw providerError(error);
    }
  };

  return {
    sendLectureReminder: message => send(buildLectureReminderEmail(message, config)),
    sendAccountCreated: message => send(buildAccountCreatedEmail(message, config)),
    sendScheduleUpdate: message => send(buildScheduleUpdateEmail(message, config)),
  };
}
