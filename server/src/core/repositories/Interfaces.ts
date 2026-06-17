import { Task, Project, User, Notification } from '../entities/Task.js';

export interface INotificationRepository {
  findAllByUserId(userId: string): Promise<Notification[]>;
  create(notification: Partial<Notification>): Promise<Notification>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<boolean>;
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findAll(filter?: any): Promise<Task[]>;
  create(task: Partial<Task>): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<boolean>;
}

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  create(project: Partial<Project>): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<boolean>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByAuth0Id(auth0Id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  findByManager(managerId: string): Promise<User[]>;
}
