import { MongoTaskRepository } from './MongoTaskRepository.js';
import { MongoAuditLogRepository } from './MongoAuditLogRepository.js';
import { MongoNoteRepository } from './MongoNoteRepository.js';
import { MongoProjectRepository } from './MongoProjectRepository.js';
import { MongoUserRepository } from './MongoUserRepository.js';
import { MongoNotificationRepository } from './MongoNotificationRepository.js';

export class RepositoryFactory {
  static getTaskRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoTaskRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static getAuditLogRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoAuditLogRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static getNoteRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoNoteRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static getProjectRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoProjectRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static getUserRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoUserRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  static getNotificationRepository() {
    const dbType = process.env.DB_TYPE || 'mongodb';
    switch (dbType) {
      case 'mongodb':
        return new MongoNotificationRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
