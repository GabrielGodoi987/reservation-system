import { Either, AppError } from '../../lib/either';
import { UserEntity } from '../../domain/entities/user/user.entity';

export interface IUserService {
  findAll(): Promise<Either<AppError, UserEntity[]>>;
  findById(id: string): Promise<Either<AppError, UserEntity | null>>;
  create(user: UserEntity): Promise<Either<AppError, void>>;
}