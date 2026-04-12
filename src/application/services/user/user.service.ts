import { Either, right, left, AppError, toAppError } from '../../../lib/either';
import { IUserService } from '../../interfaces/user-service.interface';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository';

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<Either<AppError, UserEntity[]>> {
    try {
      const users = await this.userRepository.findAll();
      return right(users);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async findById(id: string): Promise<Either<AppError, UserEntity | null>> {
    try {
      const user = await this.userRepository.findById(id);
      return right(user);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async create(user: UserEntity): Promise<Either<AppError, void>> {
    try {
      await this.userRepository.save(user);
      return right(undefined);
    } catch (error) {
      return left(toAppError(error));
    }
  }
}