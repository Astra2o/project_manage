import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: String,
  type: String,
  message: String,
  link: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
