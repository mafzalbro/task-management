import { AuditLog } from '../entities/AuditLog.js';

export interface IAuditLogRepository {
  create(log: Partial<AuditLog>): Promise<AuditLog>;
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}
