export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BACKLOG';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;

  // Enterprise Enhancements
  parentId?: string; // For subtasks
  dependencyIds?: string[]; // IDs of tasks this task depends on (blockers)
  estimate?: number; // Effort estimate (e.g. story points or hours)
  actualEffort?: number; // Actual effort spent
  energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH'; // For energy-based scheduling
  tags?: string[];
  sprintId?: string;
}

export interface Sprint {
    id: string;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  auth0Id: string;
  role: UserRole;
  managerId?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}
