import { DateRange } from "src/domain/value-objects/date-range/date-range";
import { BookingEntity } from "../booking/booking.entity";

export class PropertyEntity {
  private readonly id: string;
  private readonly name: string;
  private readonly description: string;
  private readonly price: number;
  private readonly minGuests: number;
  private readonly maxGuests: number;
  private readonly bookings: BookingEntity[] = [];

  constructor(
    id: string,
    name: string,
    description: string,
    pricePerNight: number,
    minGuests: number,
    maxGuests: number,
  ) {
    this.validateGuestsNumber(maxGuests);

    if (!name) {
      throw new Error("Name cannot be empty");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.price = pricePerNight;
    this.minGuests = minGuests;
    this.maxGuests = maxGuests;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  getMinGuests(): number {
    return this.minGuests;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  // test yourself - homework: implement the addBooking and getBookings methods in the property entity, and write tests for them.
  addBooking(booking: BookingEntity): void {
    this.bookings.push(booking);
  }

  getBookings(): BookingEntity[] {
    return [...this.bookings];
  }

  public validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new Error("Max guests exceeded");
    }
  }

  // First coupling: the property entity is responsible for calculating the total price of a reservation, which is a responsibility that should belong to the reservation entity. This creates a tight coupling between the property and reservation entities, making it difficult to change one without affecting the other.
  public calculateTotalPrice(dateRange: DateRange): number {
    const getTotalNights = dateRange.getTotalNights();
    if (getTotalNights >= 7) {
      const discount = 0.1;
      return this.price * getTotalNights * (1 - discount);
    }
    return this.price * getTotalNights;
  }

  private validateGuestsNumber(guestsNumber: number): void {
    if (guestsNumber < 0) {
      throw new Error("Max guests cannot be negative");
    }

    if (guestsNumber === 0) {
      throw new Error("Max guests cannot be zero");
    }
  }

  public isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange),
    );
  }
}
