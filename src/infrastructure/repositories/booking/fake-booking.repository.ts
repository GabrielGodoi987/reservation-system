import { BookingEntity } from "../../../domain/entities/booking/booking.entity";
import { PropertyEntity } from "../../../domain/entities/property/property.entity";
import { UserEntity } from "../../../domain/entities/user/user.entity";
import { BookingRepository } from "../../../domain/repositories/booking.repository";
import { DateRange } from "../../../domain/value-objects/date-range/date-range";

export class FakeBookingRepository implements BookingRepository {
  private bookings: BookingEntity[] = Array.from({ length: 5 }, (_, i) => {
    const property = new PropertyEntity(
      `property-${i}`,
      `Property ${i}`,
      `Description ${i}`,
      100,
      2,
      10,
    );

    const user = new UserEntity(`user-${i}`, `User ${i}`);

    const dateRange = new DateRange(
      new Date(2026, 0, i + 1),
      new Date(2026, 0, i + 3),
    );

    const booking = new BookingEntity(
      `booking-${i}`,
      property,
      user,
      dateRange,
      2,
    );
    return booking;
  });

  async findAll(): Promise<BookingEntity[]> {
    return this.bookings;
  }

  async findOne(bookingId: string): Promise<BookingEntity | null> {
    const booking = this.bookings.find((b) => b["id"] === bookingId);
    return booking ?? null;
  }

  async save(booking: BookingEntity): Promise<void> {
    const index = this.bookings.findIndex((b) => b["id"] === booking["id"]);

    if (index !== -1) {
      this.bookings[index] = booking;
      return;
    }

    this.bookings.push(booking);
  }
}
