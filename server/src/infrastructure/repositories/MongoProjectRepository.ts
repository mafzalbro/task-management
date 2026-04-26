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
}
