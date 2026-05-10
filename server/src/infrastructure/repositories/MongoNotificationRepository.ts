import mongoose from 'mongoose';
import { Notification } from '../../core/entities/Task.js';
import { INotificationRepository } from '../../core/repositories/Interfaces.js';

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);

export class MongoNotificationRepository implements INotificationRepository {
  async findAllByUserId(userId: string): Promise<Notification[]> {
    const docs = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    return docs.map(this.mapToEntity);
  }

  async create(notification: Partial<Notification>): Promise<Notification> {
    const doc = await NotificationModel.create(notification);
    return this.mapToEntity(doc);
  }

  async markAsRead(id: string): Promise<Notification> {
    const doc = await NotificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!doc) throw new Error('Notification not found');
    return this.mapToEntity(doc);
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    await NotificationModel.updateMany({ userId, read: false }, { read: true });
    return true;
  }

  private mapToEntity(doc: any): Notification {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      message: doc.message,
      type: doc.type,
      read: doc.read,
      createdAt: doc.createdAt,
    };
  }
}
