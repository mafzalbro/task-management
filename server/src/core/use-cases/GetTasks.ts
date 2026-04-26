import { ITaskRepository } from '../repositories/Interfaces.js';
import { Task } from '../entities/Task.js';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filter?: any): Promise<Task[]> {
    return this.taskRepository.findAll(filter);
  }
}
