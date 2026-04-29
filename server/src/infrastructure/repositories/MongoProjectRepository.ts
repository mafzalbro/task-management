import { IProjectRepository } from '../../core/repositories/Interfaces.js';
import { Project } from '../../core/entities/Task.js';
import { ProjectModel } from '../database/ProjectModel.js';

export class MongoProjectRepository implements IProjectRepository {
  private mapToEntity(doc: any): Project {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      ownerId: doc.ownerId,
      teamIds: doc.teamIds,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findById(id: string): Promise<Project | null> {
    const doc = await ProjectModel.findById(id);
    return doc ? this.mapToEntity(doc) : null;
  }

  async findAll(): Promise<Project[]> {
    const docs = await ProjectModel.find().sort({ createdAt: -1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async create(project: Partial<Project>): Promise<Project> {
    const doc = await ProjectModel.create(project);
    return this.mapToEntity(doc);
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const doc = await ProjectModel.findByIdAndUpdate(id, project, { new: true });
    if (!doc) throw new Error('Project not found');
    return this.mapToEntity(doc);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProjectModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}
