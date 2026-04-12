import { UserEntity } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/repositories/user.repository";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserPersistenceEntity } from "@/infrastructure/persistence/entities/user.persistence.entity";

export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly userDataSource: Repository<UserPersistenceEntity>) { }

  async save(userEntity: UserEntity): Promise<void> {
    const persistenceEntity = new UserPersistenceEntity();
    persistenceEntity.id = userEntity.getId();
    persistenceEntity.name = userEntity.getName();
    await this.userDataSource.save(persistenceEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const found = await this.userDataSource.findOne({
      where: { id } as FindOptionsWhere<UserPersistenceEntity>,
    });
    if (!found) return null;
    return new UserEntity(found.id, found.name);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userDataSource.find();
    return users.map((u) => new UserEntity(u.id, u.name));
  }

  async update(id: string, userEntity: UserEntity): Promise<void> {
    await this.userDataSource.update(id, {
      name: userEntity.getName(),
    } as any);
  }

  async delete(id: string): Promise<void> {
    await this.userDataSource.delete(id);
  }
}
