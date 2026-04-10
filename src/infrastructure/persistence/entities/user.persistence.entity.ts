import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('users')
export class UserPersistenceEntity {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id!: string;

  @Column()
  name!: string;
}