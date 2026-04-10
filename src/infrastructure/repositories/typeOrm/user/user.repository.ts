import { UserEntity } from "@/domain/entities/user/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserPersistenceEntity } from "@/infrastructure/persistence/entities/user.persistence.entity";

export class UserRepository {
  constructor(private readonly userDataSource: Repository<UserPersistenceEntity>) { }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const persistenceEntity = new UserPersistenceEntity();
    persistenceEntity.id = userEntity.getId();
    persistenceEntity.name = userEntity.getName();
    const saved = await this.userDataSource.save(persistenceEntity);
    return new UserEntity(saved.id, saved.name);
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
