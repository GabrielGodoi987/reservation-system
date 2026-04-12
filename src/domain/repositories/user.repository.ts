import { UserEntity } from "../entities/user/user.entity";

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<void>;
  findById(id: string): Promise<UserEntity | null>;
}
