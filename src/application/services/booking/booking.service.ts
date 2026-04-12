import { randomUUID } from "node:crypto";
import { Either, right, left, AppError, toAppError, notFound, isLeft } from '../../../lib/either';
import { IBookingService } from '../../interfaces/booking-service.interface';
import { BookingEntity } from '../../../domain/entities/booking/booking.entity';
import { IBookingRepository } from '../../../domain/repositories/booking.repository';
import { DateRange } from '../../../domain/value-objects/date-range/date-range';
import { IPropertyService } from '../../interfaces/property-service.interface';
import { IUserService } from '../../interfaces/user-service.interface';
import { CreateBookingDto } from "./dto/create-booking.dto";

export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly propertyService: IPropertyService,
    private readonly userService: IUserService,
  ) {}

  async findAll(): Promise<Either<AppError, BookingEntity[]>> {
    try {
      const bookings = await this.bookingRepository.findAll();
      return right(bookings);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async findOne(id: string): Promise<Either<AppError, BookingEntity>> {
    try {
      const booking = await this.bookingRepository.findOne(id);
      if (!booking) {
        return left(notFound('Booking was not found'));
      }
      return right(booking);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async create(dto: CreateBookingDto): Promise<Either<AppError, BookingEntity>> {
    try {
      const { propertyId, guestId, startDate, endDate, guestCount } = dto;

      const propertyResult = await this.propertyService.findById(propertyId);
      if (isLeft(propertyResult)) {
        return left(propertyResult.left);
      }
      const property = propertyResult.right;

      if (!property) {
        return left(notFound('Property not found'));
      }

      const userResult = await this.userService.findById(guestId);
      if (isLeft(userResult)) {
        return left(userResult.left);
      }
      const guest = userResult.right;

      if (!guest) {
        return left(notFound('User not found'));
      }

      const dateRange = new DateRange(startDate, endDate);

      const id = randomUUID();

      const newBooking = new BookingEntity(
        id,
        property,
        guest,
        dateRange,
        guestCount,
      );

      await this.bookingRepository.save(newBooking);

      return right(newBooking);
    } catch (error) {
      return left(toAppError(error));
    }
  }

  async cancel(id: string): Promise<Either<AppError, void>> {
    try {
      const bookingResult = await this.findOne(id);
      
      if (isLeft(bookingResult)) {
        return left(bookingResult.left);
      }

      const booking = bookingResult.right;
      booking.cancel(new Date());
      await this.bookingRepository.save(booking);

      return right(undefined);
    } catch (error) {
      return left(toAppError(error));
    }
  }
}