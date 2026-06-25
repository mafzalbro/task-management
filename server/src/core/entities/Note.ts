export interface Note {
  id: string;
  title: string;
  content: string;
  taskId?: string;
  projectId?: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}
