import { BookingEntity } from "@/domain/entities/booking/booking.entity";
import { IBookingRepository } from "@/domain/repositories/booking.repository";
import { BookingPersistenceEntity } from "@/infrastructure/persistence/entities/booking.persistence.entity";
import { PropertyPersistenceEntity } from "@/infrastructure/persistence/entities/property.persistence.entity";
import { UserPersistenceEntity } from "@/infrastructure/persistence/entities/user.persistence.entity";
import { BookingMapper } from "@/infrastructure/mappers/booking.mapper";
import { PropertyMapper } from "@/infrastructure/mappers/property.mapper";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { Repository, FindOptionsWhere } from "typeorm";

export class BookingRepositoryImpl implements IBookingRepository {
  constructor(
    private readonly bookingDataSource: Repository<BookingPersistenceEntity>,
    private readonly propertyDataSource: Repository<PropertyPersistenceEntity>,
    private readonly userDataSource: Repository<UserPersistenceEntity>,
  ) {}

  async findAll(): Promise<BookingEntity[]> {
    const bookings = await this.bookingDataSource.find({ relations: ['property', 'user'] });
    return bookings.map((b) => {
      const property = PropertyMapper.toDomain(b.property);
      const user = new UserEntity(b.user.id, b.user.name);
      return BookingMapper.toDomain(b, property, user);
    });
  }

  async findOne(bookingId: string): Promise<BookingEntity | null> {
    const found = await this.bookingDataSource.findOne({
      where: { id: bookingId } as FindOptionsWhere<BookingPersistenceEntity>,
      relations: ['property', 'user'],
    });
    if (!found) return null;
    
    const property = PropertyMapper.toDomain(found.property);
    const user = new UserEntity(found.user.id, found.user.name);
    return BookingMapper.toDomain(found, property, user);
  }

  async save(bookingEntity: BookingEntity): Promise<void> {
    const persistenceEntity = BookingMapper.toPersistence(bookingEntity);
    await this.bookingDataSource.save(persistenceEntity);
  }
}