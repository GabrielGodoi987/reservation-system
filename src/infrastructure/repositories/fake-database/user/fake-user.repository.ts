import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/repositories/user.repository";

export class FakeUserRepository implements IUserRepository {
  private users: UserEntity[] = Array.from({ length: 10 }, (_, i: number) => {
    return new UserEntity(`${i}`, `User ${i}`);
  });

  async findAll(): Promise<UserEntity[]> {
    return await this.users;
  }

  async findById(id: string): Promise<UserEntity | null> {
    return (await this.users.find((user) => user.getId() == id)) || null;
  }

  async save(user: UserEntity) {
    this.users.push(user);
  }
}
