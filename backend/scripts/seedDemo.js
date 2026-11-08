import mongoose from 'mongoose';
import { getConfig } from '../src/config.js';
import { initialClasses, courses, initialPeople, initialRooms, initialBatches } from '../../frontend/src/data.js';
import { Batch, Course, Lecturer, Lecture, Room } from '../src/models/resources.js';

const seedSets = [
  { model: Lecture, records: initialClasses, key: record => ({ code: record.code, day: record.day, start: record.start, batch: record.batch }) },
  { model: Course, records: courses, key: record => ({ code: record.code }) },
  { model: Lecturer, records: initialPeople, key: record => ({ name: record.name }) },
  { model: Room, records: initialRooms, key: record => ({ code: record.code }) },
  { model: Batch, records: initialBatches, key: record => ({ name: record.name }) },
];

try {
  const config = getConfig();
  await mongoose.connect(config.MONGODB_URI, {
    dbName: config.MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
  });
  for (const { model, records, key } of seedSets) {
    await model.createIndexes();
    const operations = records.map(({ id, ...record }) => ({
      updateOne: { filter: key(record), update: { $setOnInsert: record }, upsert: true },
    }));
    if (operations.length) await model.bulkWrite(operations, { ordered: true });
  }
  console.info('Demo scheduling records were added only when their unique keys were missing.');
} catch (error) {
  console.error(`Demo data seeding failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
