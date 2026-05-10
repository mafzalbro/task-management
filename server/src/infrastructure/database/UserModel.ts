import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../core/entities/Task.js';

export interface IUserDocument extends Omit<User, 'id'>, Document {}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatarUrl: { type: String },
  auth0Id: { type: String, required: true, unique: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER', 'TEAM_LEAD', 'EMPLOYEE'], default: 'EMPLOYEE' },
  managerId: { type: String },
}, { timestamps: true });

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
