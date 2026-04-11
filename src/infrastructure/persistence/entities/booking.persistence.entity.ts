import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { PropertyPersistenceEntity } from "./property.persistence.entity";
import { UserPersistenceEntity } from "./user.persistence.entity";
import { BookingStatus } from "@/domain/enums/booking-status.enum";

@Entity('bookings')
export class BookingPersistenceEntity {
  @PrimaryColumn('uuid', { generated: 'uuid' })
  id!: string;

  @Column('uuid')
  propertyId!: string;

  @ManyToOne(() => PropertyPersistenceEntity, (property) => property.bookings)
  @JoinColumn({ name: 'propertyId' })
  property!: PropertyPersistenceEntity;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => UserPersistenceEntity, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user!: UserPersistenceEntity;

  @Column()
  userName!: string;

  @Column('timestamp')
  startDate!: Date;

  @Column('timestamp')
  endDate!: Date;

  @Column()
  guestsNumber!: number;

  @Column()
  status!: BookingStatus;

  @Column('decimal')
  totalPrice!: number;
}