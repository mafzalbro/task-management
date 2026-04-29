import { Task, Project, User } from '../entities/Task.js';

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
}
