import { BookingEntity } from "../entities/booking/booking.entity";

export interface IBookingRepository {
  findAll(): Promise<BookingEntity[]>;
  save(booking: BookingEntity): Promise<void>;
  findOne(bookingId: string): Promise<BookingEntity | null>;
}
