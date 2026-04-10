import { Repository } from 'typeorm';
import { UserEntity } from '../../../../src/domain/entities/user/user.entity';
import { UserRepository } from '../../../../src/infrastructure/repositories/typeOrm/user/user.repository';
import { AppDataSource } from '../../../../src/data-source';
import { UserPersistenceEntity } from '../../../../src/infrastructure/persistence/entities/user.persistence.entity';

describe('User repository unit test - TypeORM', () => {
  let userRepository: UserRepository;
  let repository: Repository<UserPersistenceEntity>;

  beforeAll(async () => { 
    await AppDataSource.initialize();
    repository = AppDataSource.getRepository(UserPersistenceEntity);
    userRepository = new UserRepository(repository);
  });

  afterAll(async () => { 
    await AppDataSource.destroy();
  });

  afterEach(async () => {
    await AppDataSource.query('TRUNCATE TABLE users CASCADE');
  });

  describe('save', () => {
    it('Should save a user successfully', async () => {
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440001', 'Gabriel Godoi');

      await userRepository.save(user);

      const savedUser = await repository.findOne({ where: { id: user.getId() } });

      expect(savedUser).not.toBeNull();
      expect(savedUser!.id).toBe(user.getId());
    });

    it('Should throw error when creating user with empty name', () => {
      expect(() => new UserEntity('550e8400-e29b-41d4-a716-446655440002', '')).toThrow('Name cannot be empty');
    });
  });

  describe('findById', () => {
    it('Should find a user by id successfully', async () => {
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440003', 'John Doe');
      await repository.save(user as any);

      const foundUser = await userRepository.findById('550e8400-e29b-41d4-a716-446655440003');

      expect(foundUser).not.toBeNull();
      expect(foundUser!.getId()).toBe('550e8400-e29b-41d4-a716-446655440003');
      expect(foundUser!.getName()).toBe('John Doe');
    });

    it('Should return null when user not found', async () => {
      const foundUser = await userRepository.findById('550e8400-e29b-41d4-a716-446655440999');

      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('Should find all users successfully', async () => {
      const user1 = new UserEntity('550e8400-e29b-41d4-a716-446655440004', 'User One');
      const user2 = new UserEntity('550e8400-e29b-41d4-a716-446655440005', 'User Two');
      const user3 = new UserEntity('550e8400-e29b-41d4-a716-446655440006', 'User Three');

      await repository.save(user1 as any);
      await repository.save(user2 as any);
      await repository.save(user3 as any);

      const users = await userRepository.findAll();

      expect(users.length).toBe(3);
    });

    it('Should return empty array when no users exist', async () => {
      const users = await userRepository.findAll();

      expect(users).toEqual([]);
    });
  });

  describe('update', () => {
    it('Should update a user successfully', async () => {
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440007', 'Original Name');
      await repository.save(user as any);

      const updatedUser = new UserEntity('550e8400-e29b-41d4-a716-446655440007', 'Updated Name');
      await userRepository.update('550e8400-e29b-41d4-a716-446655440007', updatedUser);

      const foundUser = await userRepository.findById('550e8400-e29b-41d4-a716-446655440007');

      expect(foundUser).not.toBeNull();
      expect(foundUser!.getName()).toBe('Updated Name');
    });

    it('Should not throw when updating non-existent user', async () => {
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440999', 'NonExistent');

      await expect(userRepository.update('550e8400-e29b-41d4-a716-446655440999', user)).resolves.not.toThrow();
    });
  });

  describe('delete', () => {
    it('Should delete a user successfully', async () => {
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440008', 'To Be Deleted');
      await repository.save(user as any);

      await userRepository.delete('550e8400-e29b-41d4-a716-446655440008');

      const deletedUser = await userRepository.findById('550e8400-e29b-41d4-a716-446655440008');

      expect(deletedUser).toBeNull();
    });

    it('Should not throw when deleting non-existent user', async () => {
      await expect(userRepository.delete('550e8400-e29b-41d4-a716-446655440999')).resolves.not.toThrow();
    });
  });
});
