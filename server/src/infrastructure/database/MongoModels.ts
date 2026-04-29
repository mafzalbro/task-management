import mongoose, { Schema, Document } from 'mongoose';
import { Task, TaskStatus, TaskPriority } from '../../core/entities/Task.js';

export interface ITaskDocument extends Omit<Task, 'id'>, Document {}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'], default: 'TODO' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  dueDate: { type: String },
  projectId: { type: String, required: true, index: true },
  assigneeId: { type: String, index: true },
  creatorId: { type: String, required: true },
  metadata: { type: Map, of: Schema.Types.Mixed },
}, { timestamps: true });

export const TaskModel = mongoose.model<ITaskDocument>('Task', TaskSchema);
