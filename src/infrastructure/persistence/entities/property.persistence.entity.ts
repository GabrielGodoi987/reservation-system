import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { BookingPersistenceEntity } from "./booking.persistence.entity";

@Entity('properties')
export class PropertyPersistenceEntity {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column('decimal')
  pricePerNight!: number;

  @Column()
  minGuests!: number;

  @Column()
  maxGuests!: number;

  @OneToMany(() => BookingPersistenceEntity, (booking) => booking.property)
  bookings!: BookingPersistenceEntity[];
}