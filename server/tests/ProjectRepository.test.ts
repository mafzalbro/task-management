import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoProjectRepository } from '../src/infrastructure/repositories/MongoProjectRepository.js';
import { ProjectModel } from '../src/infrastructure/database/ProjectModel.js';

vi.mock('../src/infrastructure/database/ProjectModel.js', () => ({
  ProjectModel: {
    findById: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
  }
}));

describe('MongoProjectRepository', () => {
  let repository: MongoProjectRepository;

  beforeEach(() => {
    repository = new MongoProjectRepository();
    vi.clearAllMocks();
  });

  it('should find project by id', async () => {
    const mockProject = {
      _id: '69ef7eb556dae8223a6ba204',
      name: 'Test Project',
      description: 'Test Description',
      ownerId: 'user1',
      teamIds: ['user1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (ProjectModel.findById as any).mockResolvedValueOnce(mockProject);

    const result = await repository.findById('69ef7eb556dae8223a6ba204');

    expect(ProjectModel.findById).toHaveBeenCalledWith('69ef7eb556dae8223a6ba204');
    expect(result?.name).toBe('Test Project');
    expect(result?.id).toBe(mockProject._id);
  });

  it('should create a project', async () => {
    const projectData = { name: 'New Project', ownerId: 'user1' };
    const mockCreatedProject = {
      _id: 'new-id',
      ...projectData,
      teamIds: ['user1'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (ProjectModel.create as any).mockResolvedValueOnce(mockCreatedProject);

    const result = await repository.create(projectData);

    expect(ProjectModel.create).toHaveBeenCalledWith(projectData);
    expect(result.id).toBe('new-id');
  });
});
