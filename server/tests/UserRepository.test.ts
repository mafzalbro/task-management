import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoUserRepository } from '../src/infrastructure/repositories/MongoUserRepository.js';
import { UserModel } from '../src/infrastructure/database/UserModel.js';

vi.mock('../src/infrastructure/database/UserModel.js', () => ({
  UserModel: {
    findById: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn(),
  }
}));

describe('MongoUserRepository', () => {
  let repository: MongoUserRepository;

  beforeEach(() => {
    repository = new MongoUserRepository();
    vi.clearAllMocks();
  });

  it('should find user by Auth0 ID when findById fails with CastError', async () => {
    const auth0Id = 'auth0|123';
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      auth0Id,
      createdAt: new Date(),
    };

    // First call to findById throws (CastError simulation)
    (UserModel.findById as any).mockRejectedValueOnce(new Error('Cast to ObjectId failed'));
    // Fallback to findOne by auth0Id
    (UserModel.findOne as any).mockResolvedValueOnce(mockUser);

    const result = await repository.findById(auth0Id);

    expect(UserModel.findById).toHaveBeenCalledWith(auth0Id);
    expect(UserModel.findOne).toHaveBeenCalledWith({ auth0Id });
    expect(result?.id).toBe(mockUser._id);
  });

  it('should return null for guest-user without database call', async () => {
    const result = await repository.findById('guest-user');
    expect(result).toBeNull();
    expect(UserModel.findById).not.toHaveBeenCalled();
  });
});
