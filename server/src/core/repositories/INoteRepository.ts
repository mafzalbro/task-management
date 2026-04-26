import { Note } from '../entities/Note.js';

export interface INoteRepository {
  create(note: Partial<Note>): Promise<Note>;
  findAll(filter: any): Promise<Note[]>;
  findById(id: string): Promise<Note | null>;
  update(id: string, note: Partial<Note>): Promise<Note>;
  delete(id: string): Promise<boolean>;
}
