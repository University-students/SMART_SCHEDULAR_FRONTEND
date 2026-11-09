import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calendarTimes,
  fmt,
  timeInputToHour,
  timeInputValue,
} from '../src/data.js';
import { findScheduleConflicts } from '../src/utils/scheduling.js';

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

test('editing a lecture excludes itself from conflict results', () => {
  const lecture = {
    id: 'lecture-1',
    day: 0,
    start: 8,
    end: 10,
    room: 'LT 01',
    lecturer: 'Dr. Example',
    batch: 'ICT 22',
  };
  assert.deepEqual(findScheduleConflicts([lecture], { ...lecture, start: 8.25, end: 10.25 }), []);
  assert.equal(findScheduleConflicts(
    [lecture],
    { ...lecture, id: 'lecture-2', start: 9, end: 11 },
  ).length, 1);
});
