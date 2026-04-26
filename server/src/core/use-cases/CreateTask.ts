import { ITaskRepository } from '../repositories/Interfaces.js';
import { Task } from '../entities/Task.js';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskData: Partial<Task>): Promise<Task> {
    if (!taskData.title) throw new Error('Task title is required');
    if (!taskData.projectId) throw new Error('Project ID is required');
    if (!taskData.creatorId) throw new Error('Creator ID is required');

    return this.taskRepository.create({
      ...taskData,
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
    });
  }
}
