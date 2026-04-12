import { DataSource } from 'typeorm';
import { IUserRepository } from '../domain/repositories/user.repository';
import { IPropertyRepository } from '../domain/repositories/property.repository';
import { IBookingRepository } from '../domain/repositories/booking.repository';
import { UserRepositoryImpl } from '../infrastructure/repositories/typeOrm/user/user.repository';
import { PropertyRepositoryImpl } from '../infrastructure/repositories/typeOrm/property/property.repository';
import { BookingRepositoryImpl } from '../infrastructure/repositories/typeOrm/booking/booking.repository';
import { UserPersistenceEntity } from '../infrastructure/persistence/entities/user.persistence.entity';
import { PropertyPersistenceEntity } from '../infrastructure/persistence/entities/property.persistence.entity';
import { BookingPersistenceEntity } from '../infrastructure/persistence/entities/booking.persistence.entity';
import { IUserService } from '../application/interfaces/user-service.interface';
import { IPropertyService } from '../application/interfaces/property-service.interface';
import { IBookingService } from '../application/interfaces/booking-service.interface';
import { UserService } from '../application/services/user/user.service';
import { PropertyService } from '../application/services/property/property.service';
import { BookingService } from '../application/services/booking/booking.service';

export interface Repositories {
  userRepository: IUserRepository;
  propertyRepository: IPropertyRepository;
  bookingRepository: IBookingRepository;
}

export interface Services {
  userService: IUserService;
  propertyService: IPropertyService;
  bookingService: IBookingService;
}

export function createRepositories(dataSource: DataSource): Repositories {
  const userRepository = new UserRepositoryImpl(
    dataSource.getRepository(UserPersistenceEntity)
  );

  const propertyRepository = new PropertyRepositoryImpl(
    dataSource.getRepository(PropertyPersistenceEntity)
  );

  const bookingRepository = new BookingRepositoryImpl(
    dataSource.getRepository(BookingPersistenceEntity),
    dataSource.getRepository(PropertyPersistenceEntity),
    dataSource.getRepository(UserPersistenceEntity)
  );

  return {
    userRepository,
    propertyRepository,
    bookingRepository,
  };
}

export function createServices(repositories: Repositories): Services {
  const userService = new UserService(repositories.userRepository);
  const propertyService = new PropertyService(repositories.propertyRepository);
  const bookingService = new BookingService(
    repositories.bookingRepository,
    propertyService,
    userService
  );

  return {
    userService,
    propertyService,
    bookingService,
  };
}