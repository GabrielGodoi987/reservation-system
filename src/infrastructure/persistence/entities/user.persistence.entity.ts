import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { BookingPersistenceEntity } from "./booking.persistence.entity";

@Entity('users')
export class UserPersistenceEntity {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id!: string;

  @Column()
  name!: string;

  @OneToMany(() => BookingPersistenceEntity, (booking) => booking.user)
  bookings!: BookingPersistenceEntity[];
}