import mongoose, { Schema, Document } from 'mongoose';
import { Note } from '../../core/entities/Note.js';

export interface INoteDocument extends Omit<Note, 'id'>, Document {}

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  taskId: { type: String, index: true },
  projectId: { type: String, index: true },
  creatorId: { type: String, required: true },
}, { timestamps: true });

export const NoteModel = mongoose.model<INoteDocument>('Note', NoteSchema);
