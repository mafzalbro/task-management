import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog } from '../../core/entities/AuditLog.js';

export interface IAuditLogDocument extends Omit<AuditLog, 'id'>, Document {}

const AuditLogSchema = new Schema({
  entityType: { type: String, required: true },
  entityId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  userId: { type: String, required: true },
  previousData: { type: Schema.Types.Mixed },
  newData: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const AuditLogModel = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
