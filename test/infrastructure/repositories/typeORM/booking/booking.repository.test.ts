import { Repository } from 'typeorm';
import { BookingEntity } from '@/domain/entities/booking/booking.entity';
import { PropertyEntity } from '@/domain/entities/property/property.entity';
import { UserEntity } from '@/domain/entities/user/user.entity';
import { DateRange } from '@/domain/value-objects/date-range/date-range';
import { BookingRepositoryImpl } from '@/infrastructure/repositories/typeOrm/booking/booking.repository';
import { AppDataSource } from '@/data-source';
import { BookingPersistenceEntity } from '@/infrastructure/persistence/entities/booking.persistence.entity';
import { PropertyPersistenceEntity } from '@/infrastructure/persistence/entities/property.persistence.entity';
import { UserPersistenceEntity } from '@/infrastructure/persistence/entities/user.persistence.entity';

describe('Booking repository unit test - TypeORM', () => {
  let bookingRepository: BookingRepositoryImpl;
  let bookingRepositoryData: Repository<BookingPersistenceEntity>;
  let propertyRepositoryData: Repository<PropertyPersistenceEntity>;
  let userRepositoryData: Repository<UserPersistenceEntity>;

  beforeAll(async () => { 
    await AppDataSource.initialize();
    bookingRepositoryData = AppDataSource.getRepository(BookingPersistenceEntity);
    propertyRepositoryData = AppDataSource.getRepository(PropertyPersistenceEntity);
    userRepositoryData = AppDataSource.getRepository(UserPersistenceEntity);
    bookingRepository = new BookingRepositoryImpl(bookingRepositoryData, propertyRepositoryData, userRepositoryData);
  });

  afterAll(async () => { 
    await AppDataSource.destroy();
  });

  afterEach(async () => {
    await AppDataSource.query('TRUNCATE TABLE bookings CASCADE');
    await AppDataSource.query('TRUNCATE TABLE properties CASCADE');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE');
  });

  describe('save', () => {
    it('Should save a booking successfully', async () => {
      const property = new PropertyEntity(
        '550e8400-e29b-41d4-a716-446655440001',
        'Beach House',
        'Beautiful beach house',
        200,
        2,
        6,
      );
      await propertyRepositoryData.save(property as any);

      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440001', 'John Doe');
      const dateRange = new DateRange(new Date(2026, 3, 1), new Date(2026, 3, 5));
      const booking = new BookingEntity(
        '550e8400-e29b-41d4-a716-446655440001',
        property,
        user,
        dateRange,
        2,
      );

      await bookingRepository.save(booking);

      const savedBooking = await bookingRepositoryData.findOne({ where: { id: booking.getId() } });

      expect(savedBooking).not.toBeNull();
      expect(savedBooking!.id).toBe(booking.getId());
      expect(savedBooking!.propertyId).toBe(property.getId());
      expect(savedBooking!.guestsNumber).toBe(2);
    });

    it('Should throw error when creating booking with zero guests', () => {
      const property = new PropertyEntity('550e8400-e29b-41d4-a716-446655440002', 'Test Property', 'Desc', 100, 1, 4);
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440002', 'Jane Doe');
      const dateRange = new DateRange(new Date(2026, 3, 1), new Date(2026, 3, 5));

      expect(() => new BookingEntity('550e8400-e29b-41d4-a716-446655440002', property, user, dateRange, 0)).toThrow('guest number must be greater than zero');
    });

    it('Should throw error when guests exceed max guests', () => {
      const property = new PropertyEntity('550e8400-e29b-41d4-a716-446655440003', 'Test Property', 'Desc', 100, 1, 2);
      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440003', 'Jane Doe');
      const dateRange = new DateRange(new Date(2026, 3, 1), new Date(2026, 3, 5));

      expect(() => new BookingEntity('550e8400-e29b-41d4-a716-446655440003', property, user, dateRange, 5)).toThrow('Max guests exceeded');
    });
  });

  describe('findOne', () => {
    it('Should find a booking by id successfully', async () => {
      const property = new PropertyEntity(
        '550e8400-e29b-41d4-a716-446655440004',
        'Mountain Cabin',
        'Cozy cabin',
        150,
        1,
        4,
      );
      await propertyRepositoryData.save(property as any);

      const user = new UserEntity('550e8400-e29b-41d4-a716-446655440004', 'Alice Smith');
      const dateRange = new DateRange(new Date(2026, 4, 1), new Date(2026, 4, 3));
      const booking = new BookingEntity(
        '550e8400-e29b-41d4-a716-446655440004',
        property,
        user,
        dateRange,
        2,
      );
      await bookingRepositoryData.save(booking as any);

      const foundBooking = await bookingRepository.findOne('550e8400-e29b-41d4-a716-446655440004');

      expect(foundBooking).not.toBeNull();
      expect(foundBooking!.getId()).toBe('550e8400-e29b-41d4-a716-446655440004');
      expect(foundBooking!.getUser().getName()).toBe('Alice Smith');
    });

    it('Should return null when booking not found', async () => {
      const foundBooking = await bookingRepository.findOne('550e8400-e29b-41d4-a716-446655440999');

      expect(foundBooking).toBeNull();
    });
  });

  describe('findAll', () => {
    it('Should find all bookings successfully', async () => {
      const property1 = new PropertyEntity('550e8400-e29b-41d4-a716-446655440005', 'Property One', 'Desc', 100, 1, 4);
      const property2 = new PropertyEntity('550e8400-e29b-41d4-a716-446655440006', 'Property Two', 'Desc', 200, 2, 6);
      await propertyRepositoryData.save(property1 as any);
      await propertyRepositoryData.save(property2 as any);

      const user1 = new UserEntity('550e8400-e29b-41d4-a716-446655440005', 'User One');
      const user2 = new UserEntity('550e8400-e29b-41d4-a716-446655440006', 'User Two');

      const dateRange1 = new DateRange(new Date(2026, 5, 1), new Date(2026, 5, 3));
      const dateRange2 = new DateRange(new Date(2026, 5, 5), new Date(2026, 5, 7));

      const booking1 = new BookingEntity('550e8400-e29b-41d4-a716-446655440005', property1, user1, dateRange1, 2);
      const booking2 = new BookingEntity('550e8400-e29b-41d4-a716-446655440006', property2, user2, dateRange2, 3);

      await bookingRepositoryData.save(booking1 as any);
      await bookingRepositoryData.save(booking2 as any);

      const bookings = await bookingRepository.findAll();

      expect(bookings.length).toBe(2);
    });

    it('Should return empty array when no bookings exist', async () => {
      const bookings = await bookingRepository.findAll();

      expect(bookings).toEqual([]);
    });
  });
});