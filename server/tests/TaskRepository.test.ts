import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoTaskRepository } from '../src/infrastructure/repositories/MongoTaskRepository.js';
import { TaskModel } from '../src/infrastructure/database/MongoModels.js';

vi.mock('../src/infrastructure/database/MongoModels.js', () => ({
  TaskModel: {
    findById: vi.fn(),
    find: vi.fn().mockReturnValue({ sort: vi.fn().mockReturnThis() }),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    deleteOne: vi.fn(),
  }
}));

describe('MongoTaskRepository', () => {
  let repository: MongoTaskRepository;

  beforeEach(() => {
    repository = new MongoTaskRepository();
    vi.clearAllMocks();
  });

  it('should find all tasks with filter', async () => {
    const mockTasks = [
      { _id: '1', title: 'Task 1', status: 'TODO', priority: 'LOW', projectId: 'p1', creatorId: 'u1' },
      { _id: '2', title: 'Task 2', status: 'IN_PROGRESS', priority: 'HIGH', projectId: 'p1', creatorId: 'u1' },
    ];

    const findSpy = vi.spyOn(TaskModel, 'find').mockReturnValue({
      sort: vi.fn().mockResolvedValue(mockTasks)
    } as any);

    const result = await repository.findAll({ projectId: 'p1' });

    expect(findSpy).toHaveBeenCalledWith({ projectId: 'p1' });
    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Task 1');
  });

  it('should update a task', async () => {
    const mockUpdatedTask = { _id: '1', title: 'Updated Task', status: 'COMPLETED' };
    (TaskModel.findByIdAndUpdate as any).mockResolvedValueOnce(mockUpdatedTask);

    const result = await repository.update('1', { status: 'COMPLETED' });

    expect(TaskModel.findByIdAndUpdate).toHaveBeenCalledWith('1', { status: 'COMPLETED' }, { new: true });
    expect(result.title).toBe('Updated Task');
  });
});
