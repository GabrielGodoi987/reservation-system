import { randomUUID } from "node:crypto";
import { BookingEntity } from "@/domain/entities/booking/booking.entity";
import { PropertyEntity } from "@/domain/entities/property/property.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { IBookingRepository } from "@/domain/repositories/booking.repository";
import { DateRange } from "@/domain/value-objects/date-range/date-range";

export class FakeBookingRepository implements IBookingRepository {
  private bookings: BookingEntity[] = Array.from({ length: 5 }, (_, i) => {
    const property = new PropertyEntity(
      randomUUID(),
      `Property ${i}`,
      `Description ${i}`,
      100,
      2,
      10,
    );

    const user = new UserEntity(randomUUID(), `User ${i}`);

    const dateRange = new DateRange(
      new Date(2026, 0, i + 1),
      new Date(2026, 0, i + 3),
    );

    const booking = new BookingEntity(
      randomUUID(),
      property,
      user,
      dateRange,
      2,
    );

    return booking;
  });

  async findAll(): Promise<BookingEntity[]> {
    return await this.bookings;
  }

  async findOne(bookingId: string): Promise<BookingEntity | null> {
    const booking = this.bookings.find((b) => b["id"] === bookingId);
    return booking ?? null;
  }

  async save(booking: BookingEntity): Promise<void> {
    await this.bookings.push(booking);
  }
}
