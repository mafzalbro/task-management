export interface AuditLog {
  id: string;
  entityType: 'TASK' | 'PROJECT' | 'USER';
  entityId: string;
  action: string;
  userId: string;
  previousData?: any;
  newData?: any;
  createdAt: Date;
}
