import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['Administrator', 'Lecturer', 'Student', 'Head of Department'],
    required: true,
    default: 'Student',
  },
  emailReminders: { type: Boolean, default: false },
  batch: { type: String, trim: true, default: '', maxlength: 80 },
  active: { type: Boolean, default: true },
}, { timestamps: true, versionKey: false });

export const User = mongoose.model('User', userSchema);
