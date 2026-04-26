import { IAuditLogRepository } from '../../core/repositories/IAuditLogRepository.js';
import { AuditLog } from '../../core/entities/AuditLog.js';
import { AuditLogModel } from '../database/AuditLogModel.js';

export class MongoAuditLogRepository implements IAuditLogRepository {
  async create(log: Partial<AuditLog>): Promise<AuditLog> {
    const doc = await AuditLogModel.create(log);
    return {
      id: doc._id.toString(),
      entityType: doc.entityType as any,
      entityId: doc.entityId,
      action: doc.action,
      userId: doc.userId,
      previousData: doc.previousData,
      newData: doc.newData,
      createdAt: (doc as any).createdAt,
    };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const docs = await AuditLogModel.find({ entityType, entityId }).sort({ createdAt: -1 });
    return docs.map(doc => ({
      id: doc._id.toString(),
      entityType: doc.entityType as any,
      entityId: doc.entityId,
      action: doc.action,
      userId: doc.userId,
      previousData: doc.previousData,
      newData: doc.newData,
      createdAt: (doc as any).createdAt,
    }));
  }
}
