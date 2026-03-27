import { UserEntity } from "../../../../src/domain/entities/user/user.entity";
import { UserRepository } from "../../../../src/domain/repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserEntity[] | []> {
    return await this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(id);
  }

  async create(user: UserEntity) {
    this.userRepository.save(user);
  }
}
