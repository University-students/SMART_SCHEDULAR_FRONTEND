import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calendarTimes,
  fmt,
  timeInputToHour,
  timeInputValue,
} from '../src/data.js';

test('timetable time helpers preserve quarter-hour times', () => {
  assert.equal(timeInputToHour('10:45'), 10.75);
  assert.equal(timeInputValue(10.75), '10:45');
  assert.equal(fmt(10.75), '10:45');
  assert.equal(fmt(8), '08:00');
});

test('calendar provides every 15-minute start time from 08:00 through 17:45', () => {
  assert.equal(calendarTimes.length, 40);
  assert.equal(fmt(calendarTimes[0]), '08:00');
  assert.equal(fmt(calendarTimes[11]), '10:45');
  assert.equal(fmt(calendarTimes.at(-1)), '17:45');
});
