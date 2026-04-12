import { Either, AppError } from '../../lib/either';
import { BookingEntity } from '../../domain/entities/booking/booking.entity';
import { CreateBookingDto } from '../services/booking/dto/create-booking.dto';

export interface IBookingService {
  findAll(): Promise<Either<AppError, BookingEntity[]>>;
  findOne(id: string): Promise<Either<AppError, BookingEntity>>;
  create(dto: CreateBookingDto): Promise<Either<AppError, BookingEntity>>;
  cancel(id: string): Promise<Either<AppError, void>>;
}