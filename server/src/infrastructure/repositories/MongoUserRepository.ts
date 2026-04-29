import { IUserRepository } from '../../core/repositories/Interfaces.js';
import { User } from '../../core/entities/Task.js';
import { UserModel } from '../database/UserModel.js';

export class MongoUserRepository implements IUserRepository {
  private mapToEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      avatarUrl: doc.avatarUrl,
      auth0Id: doc.auth0Id,
      createdAt: doc.createdAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    if (!id || id === 'guest-user' || id === 'system-user') return null;
    try {
      const doc = await UserModel.findById(id);
      return doc ? this.mapToEntity(doc) : null;
    } catch (err) {
      // If it's a cast error, it might be an Auth0 ID being passed to findById
      return this.findByAuth0Id(id);
    }
  }

  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().sort({ name: 1 });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ auth0Id });
    return doc ? this.mapToEntity(doc) : null;
  }

  async create(user: Partial<User>): Promise<User> {
    const doc = await UserModel.create(user);
    return this.mapToEntity(doc);
  }
}
