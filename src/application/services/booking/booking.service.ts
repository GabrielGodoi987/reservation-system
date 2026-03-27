import { BookingEntity } from "../../../domain/entities/booking/booking.entity";
import { BookingRepository } from "../../../domain/repositories/booking.repository";
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
    const createdBooking = await this.bookingRepository.save();
  }

  async findOne(bookingId: string): Promise<BookingEntity | null> {
    const booking = await this.bookingRepository.findOne(bookingId);

    if (!booking) {
      throw new Error("Booking was not found");
    }

    return booking;
  }
}
