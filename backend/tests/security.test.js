import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import test from 'node:test';
import { cookieClearOptions, cookieOptions, hashSessionToken, originGuard, sessionCookieName } from '../src/security.js';
import { loginSchema, registrationSchema, resourceSchemas } from '../src/validation.js';
import { hasScheduleConflict } from '../src/scheduling.js';
import { createApp } from '../src/app.js';

test('registration accepts a strong password but never accepts a client-selected role', () => {
  const valid = registrationSchema.parse({
    name: 'Student Example',
    email: 'STUDENT@example.com',
    password: 'a-unique-password-with-12+',
  });
  assert.equal(valid.email, 'student@example.com');
  assert.throws(() => registrationSchema.parse({
    name: 'Administrator',
    email: 'admin@example.com',
    password: 'a-unique-password-with-12+',
    role: 'Administrator',
  }));
  assert.throws(() => registrationSchema.parse({
    name: 'Student Example',
    email: 'student@example.com',
    password: 'short',
  }));
});

test('login enforces bcrypt password byte limits', () => {
  assert.equal(loginSchema.parse({ email: 'student@example.com', password: 'a'.repeat(72) }).password.length, 72);
  assert.throws(() => loginSchema.parse({ email: 'student@example.com', password: 'a'.repeat(73) }));
  assert.throws(() => loginSchema.parse({ email: 'student@example.com', password: '😀'.repeat(19) }));
});

test('schedule input is strict and rejects invalid intervals', () => {
  const base = {
    day: 0,
    start: 8,
    end: 10,
    code: 'ICT 2201',
    title: 'Web Development',
    lecturer: 'Dr. Example',
    room: 'LT 01',
    batch: 'ICT 22',
  };
  assert.equal(resourceSchemas.classes.parse(base).color, 'violet');
  assert.equal(resourceSchemas.classes.parse({ ...base, start: 10.75, end: 12.25 }).start, 10.75);
  assert.throws(() => resourceSchemas.classes.parse({ ...base, end: 8 }));
  assert.throws(() => resourceSchemas.classes.parse({ ...base, start: 10.1 }));
  assert.throws(() => resourceSchemas.classes.parse({ ...base, isAdmin: true }));
});

test('calendar periods require valid inclusive date ranges and announcements reject extra fields', () => {
  const period = {
    title: 'Semester study break',
    type: 'Study leave',
    startDate: '2026-11-09',
    endDate: '2026-11-15',
  };
  assert.equal(resourceSchemas.calendarPeriod.parse(period).description, '');
  assert.throws(() => resourceSchemas.calendarPeriod.parse({ ...period, endDate: '2026-02-30' }));
  assert.throws(() => resourceSchemas.calendarPeriod.parse({ ...period, endDate: '2026-11-08' }));
  assert.throws(() => resourceSchemas.calendarPeriod.parse({ ...period, isAdmin: true }));
  assert.throws(() => resourceSchemas.announcement.parse({ title: 'Notice', message: 'Details', author: 'Student' }));
});

test('overlap detection checks shared resources and permits adjacent lectures', () => {
  const existing = { id: 'one', day: 0, start: 8, end: 10, room: 'LT 01', lecturer: 'Dr. Example', batch: 'ICT 22' };
  assert.equal(hasScheduleConflict([existing], { ...existing, id: 'two', start: 9, end: 11, room: 'LT 02' }), true);
  assert.equal(hasScheduleConflict([existing], { ...existing, id: 'two', start: 10, end: 12 }), false);
  assert.equal(hasScheduleConflict([existing], { ...existing, id: 'two', start: 9, end: 11, lecturer: 'Unassigned lecturer', room: 'LT 02', batch: 'ICT 23' }), false);
});

test('session cookies are HttpOnly, SameSite strict, and secure in production', () => {
  assert.equal(sessionCookieName(false), 'unischedule_session');
  assert.equal(cookieOptions(false).httpOnly, true);
  assert.equal(cookieOptions(false).sameSite, 'strict');
  assert.equal(cookieOptions(false).secure, false);
  assert.equal(sessionCookieName(true), '__Host-unischedule_session');
  assert.equal(cookieOptions(true).secure, true);
  assert.notEqual(hashSessionToken('first-token'), hashSessionToken('second-token'));
  assert.equal(cookieClearOptions(false).maxAge, undefined);
  assert.equal(cookieClearOptions(false).path, cookieOptions(false).path);
  assert.equal(cookieClearOptions(true).secure, true);
});

test('mutating requests require an explicitly allowed origin', async t => {
  const app = express();
  app.use(originGuard(['http://localhost:5173']));
  app.post('/mutate', (req, res) => res.sendStatus(204));
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  const url = `http://127.0.0.1:${server.address().port}/mutate`;

  assert.equal((await fetch(url, { method: 'POST' })).status, 403);
  assert.equal((await fetch(url, { method: 'POST', headers: { Origin: 'https://attacker.example' } })).status, 403);
  assert.equal((await fetch(url, { method: 'POST', headers: { Origin: 'http://localhost:5173' } })).status, 204);
  assert.equal((await fetch(url, { method: 'POST', headers: { Origin: new URL(url).origin } })).status, 204);
});

test('health endpoint emits security headers and API responses are not cached', async t => {
  const app = createApp({ NODE_ENV: 'test', allowedOrigins: ['http://localhost:5173'] });
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  const apiResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/classes`);
  assert.equal(apiResponse.headers.get('cache-control'), 'no-store');
  assert.equal(apiResponse.status, 401);
});

test('production serves the built frontend and keeps API requests on API handlers', async t => {
  const app = createApp({ NODE_ENV: 'production', allowedOrigins: [] });
  const server = app.listen(0);
  await once(server, 'listening');
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const home = await fetch(`${baseUrl}/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /text\/html/);
  assert.match(await home.text(), /id="root"/);

  const appRoute = await fetch(`${baseUrl}/login`);
  assert.equal(appRoute.status, 200);
  assert.match(appRoute.headers.get('content-type'), /text\/html/);

  const apiRoute = await fetch(`${baseUrl}/api/classes`);
  assert.equal(apiRoute.status, 401);
  assert.match(apiRoute.headers.get('content-type'), /application\/json/);
});
