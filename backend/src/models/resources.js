import mongoose from 'mongoose';

function createModel(name, definition, indexes = []) {
  const schema = new mongoose.Schema(definition, {
    timestamps: true,
    versionKey: false,
    strict: 'throw',
  });
  indexes.forEach(index => schema.index(index.fields, index.options));
  return mongoose.model(name, schema);
}

export const Lecture = createModel('Lecture', {
  day: { type: Number, required: true, min: 0, max: 4 },
  start: { type: Number, required: true, min: 8, max: 17.75 },
  end: { type: Number, required: true, min: 8.25, max: 18 },
  code: { type: String, required: true, trim: true, maxlength: 30 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  lecturer: { type: String, required: true, trim: true, maxlength: 120 },
  room: { type: String, required: true, trim: true, maxlength: 80 },
  batch: { type: String, required: true, trim: true, maxlength: 80 },
  color: { type: String, required: true, enum: ['violet', 'blue', 'mint', 'orange', 'pink'], default: 'violet' },
});

export const Course = createModel('Course', {
  code: { type: String, required: true, trim: true, maxlength: 30 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  lecturer: { type: String, required: true, trim: true, maxlength: 120 },
  room: { type: String, required: true, trim: true, maxlength: 80 },
  batch: { type: String, required: true, trim: true, maxlength: 80 },
  students: { type: Number, required: true, min: 0, max: 10000 },
  hours: { type: String, required: true, trim: true, maxlength: 30 },
  color: { type: String, required: true, enum: ['violet', 'blue', 'mint', 'orange', 'pink'], default: 'violet' },
}, [{ fields: { code: 1 }, options: { unique: true } }]);

export const Lecturer = createModel('Lecturer', {
  name: { type: String, required: true, trim: true, maxlength: 120 },
  role: { type: String, required: true, trim: true, maxlength: 80 },
  area: { type: String, required: true, trim: true, maxlength: 120 },
  hours: { type: Number, required: true, min: 0, max: 100 },
  status: { type: String, required: true, trim: true, maxlength: 80 },
  initials: { type: String, required: true, trim: true, maxlength: 4 },
}, [{ fields: { name: 1 }, options: { unique: true } }]);

export const Room = createModel('Room', {
  name: { type: String, required: true, trim: true, maxlength: 120 },
  code: { type: String, required: true, trim: true, maxlength: 40 },
  type: { type: String, required: true, trim: true, maxlength: 80 },
  capacity: { type: Number, required: true, min: 1, max: 10000 },
  building: { type: String, required: true, trim: true, maxlength: 120 },
  status: { type: String, required: true, trim: true, maxlength: 80 },
}, [{ fields: { code: 1 }, options: { unique: true } }]);

export const Batch = createModel('Batch', {
  name: { type: String, required: true, trim: true, maxlength: 80 },
  year: { type: String, required: true, trim: true, maxlength: 40 },
  students: { type: Number, required: true, min: 0, max: 10000 },
  semester: { type: String, required: true, trim: true, maxlength: 40 },
  courses: { type: Number, required: true, min: 0, max: 1000 },
}, [{ fields: { name: 1 }, options: { unique: true } }]);

export const Availability = createModel('Availability', {
  lecturer: { type: String, required: true, trim: true, maxlength: 120 },
  days: {
    type: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }],
    required: true,
    validate: value => value.length <= 5,
  },
}, [{ fields: { lecturer: 1 }, options: { unique: true } }]);

export const CalendarPeriod = createModel('CalendarPeriod', {
  title: { type: String, required: true, trim: true, maxlength: 120 },
  type: { type: String, required: true, enum: ['Vacation', 'Study leave'] },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  createdBy: { type: String, required: true, trim: true, maxlength: 100 },
});

export const Announcement = createModel('Announcement', {
  title: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  createdBy: { type: String, required: true, trim: true, maxlength: 100 },
});

const scheduleLockSchema = new mongoose.Schema({
  _id: { type: String, default: 'schedule' },
  revision: { type: Number, required: true, default: 0 },
}, { versionKey: false });

export const ScheduleLock = mongoose.model('ScheduleLock', scheduleLockSchema);
