import { randomUUID } from "node:crypto";
import { BookingEntity } from "../../../domain/entities/booking/booking.entity";
import { BookingRepository } from "../../../domain/repositories/booking.repository";
import { DateRange } from "../../../domain/value-objects/date-range/date-range";
import { PropertyService } from "../property/property.service";
import { UserService } from "../user/user.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly propertyService: PropertyService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<BookingEntity[]> {
    return await this.bookingRepository.findAll();
  }

  async create(bookingDto: CreateBookingDto): Promise<BookingEntity> {
    const { propertyId, guestId, startDate, endDate, guestCount } = bookingDto;
    const property = await this.propertyService.findById(propertyId);
    const guest = await this.userService.findById(guestId);

    if (!property) throw new Error("Property not founf");
    if (!guest) throw new Error("User not found");

    const dateRange = new DateRange(startDate, endDate);

    const id = randomUUID();

    const newBooking = new BookingEntity(
      id,
      property,
      guest,
      dateRange,
      guestCount,
    ); // need mock, because its very coupled

    await this.bookingRepository.save(newBooking);

    return newBooking;
  }

  async findOne(bookingId: string): Promise<BookingEntity | null> {
    const booking = await this.bookingRepository.findOne(bookingId);

    if (!booking) {
      throw new Error("Booking was not found");
    }

    return booking;
  }

  async cancel(bookingId: string): Promise<void> {
    const booking = await this.findOne(bookingId);
    booking?.cancel(new Date());
    await this.bookingRepository.save(booking!);
  }
}
