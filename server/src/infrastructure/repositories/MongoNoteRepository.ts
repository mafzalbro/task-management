import { INoteRepository } from '../../core/repositories/INoteRepository.js';
import { Note } from '../../core/entities/Note.js';
import { NoteModel } from '../database/NoteModel.js';

export class MongoNoteRepository implements INoteRepository {
  private mapToEntity(doc: any): Note {
    return {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      taskId: doc.taskId,
      projectId: doc.projectId,
      creatorId: doc.creatorId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(note: Partial<Note>): Promise<Note> {
    const doc = await NoteModel.create(note);
    return this.mapToEntity(doc);
  }

  async findAll(filter: any): Promise<Note[]> {
    const docs = await NoteModel.find(filter).sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findById(id: string): Promise<Note | null> {
    const doc = await NoteModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async update(id: string, note: Partial<Note>): Promise<Note> {
    const doc = await NoteModel.findByIdAndUpdate(id, note, { new: true });
    if (!doc) throw new Error('Note not found');
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await NoteModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
