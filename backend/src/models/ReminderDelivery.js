import mongoose from 'mongoose';

const reminderDeliverySchema = new mongoose.Schema({
  _id: { type: String },
  status: { type: String, enum: ['sending', 'sent', 'failed'], required: true },
  attempts: { type: Number, default: 0 },
  sentAt: Date,
  failedAt: Date,
  failureMessage: { type: String, maxlength: 200 },
}, { timestamps: true, versionKey: false });

export const ReminderDelivery = mongoose.model('ReminderDelivery', reminderDeliverySchema);