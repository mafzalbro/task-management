import { ITaskRepository } from '../../core/repositories/Interfaces.js';
import { Task } from '../../core/entities/Task.js';
import { TaskModel } from '../database/MongoModels.js';

export class MongoTaskRepository implements ITaskRepository {
  private mapToEntity(doc: any): Task {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      dueDate: doc.dueDate,
      projectId: doc.projectId,
      assigneeId: doc.assigneeId,
      creatorId: doc.creatorId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      metadata: doc.metadata ? Object.fromEntries(doc.metadata) : undefined,
    };
  }

  async findById(id: string): Promise<Task | null> {
    const doc = await TaskModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(filter: any = {}): Promise<Task[]> {
    const docs = await TaskModel.find(filter).sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async create(task: Partial<Task>): Promise<Task> {
    const doc = await TaskModel.create(task);
    return this.mapToEntity(doc);
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const doc = await TaskModel.findByIdAndUpdate(id, task, { new: true });
    if (!doc) throw new Error('Task not found');
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await TaskModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
