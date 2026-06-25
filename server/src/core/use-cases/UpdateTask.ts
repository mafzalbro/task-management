import { ITaskRepository } from '../repositories/Interfaces.js';
import { Task } from '../entities/Task.js';

export class UpdateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(id: string, updates: Partial<Task>): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new Error('Task not found');

    // Business logic: e.g., only creator or assignee can update (would add user check here)

    return this.taskRepository.update(id, updates);
  }
}
