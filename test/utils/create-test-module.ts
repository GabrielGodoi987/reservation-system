import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/data-source';
import { UserPersistenceEntity } from '../../src/infrastructure/persistence/entities/user.persistence.entity';
import { PropertyPersistenceEntity } from '../../src/infrastructure/persistence/entities/property.persistence.entity';
import { BookingPersistenceEntity } from '../../src/infrastructure/persistence/entities/booking.persistence.entity';
import { UserRepositoryImpl } from '../../src/infrastructure/repositories/typeOrm/user/user.repository';
import { PropertyRepositoryImpl } from '../../src/infrastructure/repositories/typeOrm/property/property.repository';
import { BookingRepositoryImpl } from '../../src/infrastructure/repositories/typeOrm/booking/booking.repository';
import { UserService } from '../../src/application/services/user/user.service';
import { PropertyService } from '../../src/application/services/property/property.service';
import { BookingService } from '../../src/application/services/booking/booking.service';

interface TestingModule {
  appDataSource: DataSource;
  userRepository: UserRepositoryImpl;
  propertyRepository: PropertyRepositoryImpl;
  bookingRepository: BookingRepositoryImpl;
  userService: UserService;
  propertyService: PropertyService;
  bookingService: BookingService;
}

export async function createTestingModule(): Promise<TestingModule> {
  await AppDataSource.initialize();

  const userRepository = new UserRepositoryImpl(
    AppDataSource.getRepository(UserPersistenceEntity)
  );
  const propertyRepository = new PropertyRepositoryImpl(
    AppDataSource.getRepository(PropertyPersistenceEntity)
  );
  const bookingRepository = new BookingRepositoryImpl(
    AppDataSource.getRepository(BookingPersistenceEntity),
    AppDataSource.getRepository(PropertyPersistenceEntity),
    AppDataSource.getRepository(UserPersistenceEntity)
  );

  const userService = new UserService(userRepository as any);
  const propertyService = new PropertyService(propertyRepository as any);
  const bookingService = new BookingService(
    bookingRepository as any,
    propertyService,
    userService
  );

  return {
    appDataSource: AppDataSource,
    userRepository,
    propertyRepository,
    bookingRepository,
    userService,
    propertyService,
    bookingService,
  };
}

export async function destroyTestingModule(module: TestingModule): Promise<void> {
  await module.appDataSource.destroy();
}