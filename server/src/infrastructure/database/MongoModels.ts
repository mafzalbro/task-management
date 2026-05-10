import mongoose, { Schema, Document } from 'mongoose';
import { Task } from '../../core/entities/Task.js';

export interface ITaskDocument extends Omit<Task, 'id'>, Document {}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BACKLOG'], default: 'TODO' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  dueDate: { type: String },
  projectId: { type: String, required: true, index: true },
  assigneeId: { type: String, index: true },
  creatorId: { type: String, required: true },
  metadata: { type: Map, of: Schema.Types.Mixed },

  // Enterprise Enhancements
  parentId: { type: String, index: true },
  dependencyIds: [{ type: String }],
  estimate: { type: Number },
  actualEffort: { type: Number },
  energyLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  tags: [{ type: String }],
  sprintId: { type: String, index: true },
  epicId: { type: String, index: true },
}, { timestamps: true });

export const TaskModel = mongoose.model<ITaskDocument>('Task', TaskSchema);

const SprintSchema = new Schema({
    name: { type: String, required: true },
    goal: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, enum: ['PLANNED', 'ACTIVE', 'COMPLETED'], default: 'PLANNED' },
    projectId: { type: String, required: true, index: true },
}, { timestamps: true });

export const SprintModel = mongoose.model('Sprint', SprintSchema);

const EpicSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED'], default: 'PLANNED' },
    projectId: { type: String, required: true, index: true },
    startDate: { type: String },
    endDate: { type: String },
}, { timestamps: true });

export const EpicModel = mongoose.model('Epic', EpicSchema);

const MilestoneSchema = new Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String },
    projectId: { type: String, required: true, index: true },
}, { timestamps: true });

export const MilestoneModel = mongoose.model('Milestone', MilestoneSchema);

const AutomationRuleSchema = new Schema({
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    action: { type: String, required: true },
    active: { type: Boolean, default: true },
    projectId: { type: String, required: true, index: true },
}, { timestamps: true });

export const AutomationRuleModel = mongoose.model('AutomationRule', AutomationRuleSchema);
