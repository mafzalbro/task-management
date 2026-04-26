import mongoose, { Schema, Document } from 'mongoose';
import { Project } from '../../core/entities/Task.js';

export interface IProjectDocument extends Omit<Project, 'id'>, Document {}

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: { type: String, required: true },
  teamIds: [{ type: String }],
}, { timestamps: true });

export const ProjectModel = mongoose.model<IProjectDocument>('Project', ProjectSchema);
