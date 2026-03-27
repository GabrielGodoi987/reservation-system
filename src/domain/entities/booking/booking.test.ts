import { BookingStatus } from "../../../../src/domain/enums/booking-status.enum";
import { context } from "../../../lib/context";
import { DateRange } from "../../value-objects/date-range/date-range";
import { PropertyEntity } from "../property/property.entity";
import { UserEntity } from "../user/user.entity";
import { BookingEntity } from "./booking.entity";

describe("Booking entity", () => {
  context("success", () => {
    it("Should create an booking object with all attributes", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        100,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-01"),
        new Date("2026-01-10"),
      );

      const booking = new BookingEntity("id", property, user, dateRange, 2);

      expect(booking).toBeInstanceOf(BookingEntity);
      expect(booking.getId()).toBe("id");
      expect(booking.getProperty()).toBe(property);
      expect(booking.getUser()).toBe(user);
      expect(booking.getDateRange()).toBe(dateRange);
      expect(booking.getGuestsNumber()).toBe(2);
    });
    it("Should calculate booking total price with discount", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        300,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-01"),
        new Date("2026-01-10"),
      );

      const booking = new BookingEntity("1", property, user, dateRange, 4);

      expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9);
    });

    it("Should calculate booking total without discount", () => {});

    it("should cancel a booking withot refund if it's cancelled less than 1 day before check-in", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        300,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-20"),
        new Date("2026-01-22"),
      );

      const booking = new BookingEntity("1", property, user, dateRange, 4);

      const currentDate = new Date("2026-01-20");

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe(BookingStatus.CANCELED);
      expect(booking.getTotalPrice()).toBe(600);
    });

    it("should cancel booking with full refund when date is upper than 7 days before check-in", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        300,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-20"),
        new Date("2026-01-25"),
      );

      const booking = new BookingEntity("1", property, user, dateRange, 4);

      const currentDate = new Date("2026-01-10");

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe(BookingStatus.CANCELED);
      expect(booking.getTotalPrice()).toBe(0);
    });

    it("should cancel booking with partial refund when the date be between 1 or 7 days before check-in", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        300,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-20"),
        new Date("2026-01-25"),
      );

      const booking = new BookingEntity("1", property, user, dateRange, 4);

      const currentDate = new Date("2026-01-15");

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe(BookingStatus.CANCELED);
      expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
    });
  });

  context("failure", () => {
    it("should throw an erro if guest number is zero or negative", () => {
      const property = new PropertyEntity(
        "1",
        "House of the Rising Sun",
        "Its been a ruin of many poor boy",
        0,
        5,
        15,
      );

      const user = new UserEntity("1", "Eric Burdon");
      const dateRange = new DateRange(
        new Date("2026-03-10"),
        new Date("2026-03-15s"),
      );

      expect(() => {
        new BookingEntity("1", property, user, dateRange, 0);
      }).toThrow("guest number must be greater than zero");

      expect(() => {
        new BookingEntity("1", property, user, dateRange, -10);
      }).toThrow("guest number must be greater than zero");
    });

    it("should throw an erro if max guest is greater than the max allowed", () => {
      const property = new PropertyEntity(
        "1",
        "House of the Rising Sun",
        "Its been a ruin of many poor boy",
        0,
        5,
        15,
      );

      const user = new UserEntity("1", "Eric Burdon");
      const dateRange = new DateRange(
        new Date("2026-03-10"),
        new Date("2026-03-15s"),
      );

      expect(() => {
        new BookingEntity("1", property, user, dateRange, 20);
      }).toThrow("Max guests exceeded");
    });
    it("Should not allow booking a property wich is not available", () => {
      const property = new PropertyEntity(
        "1",
        "House of the Rising Sun",
        "Its been a ruin of many poor boy",
        300,
        5,
        15,
      );
      const user = new UserEntity("1", "José Santos");
      const dateRange = new DateRange(
        new Date("2024-12-01"),
        new Date("2024-12-10"),
      );
      const booking = new BookingEntity("1", property, user, dateRange, 4);
      const dateRange2 = new DateRange(
        new Date("2024-12-02"),
        new Date("2024-12-09"),
      );

      expect(booking.getProperty()).toBe(property);
      expect(() => {
        new BookingEntity("2", property, user, dateRange2, 4);
      }).toThrow("Property is not available for selected date range");
    });

    it("shoud throw an error when try to cancel a booking already cancelled", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        300,
        2,
        4,
      );
      const user = new UserEntity("id", "John Doe");
      const dateRange = new DateRange(
        new Date("2026-01-20"),
        new Date("2026-01-25"),
      );

      const booking = new BookingEntity("1", property, user, dateRange, 4);

      const currentDate = new Date("2026-01-15");

      booking.cancel(currentDate);

      expect(booking.getStatus()).toBe(BookingStatus.CANCELED);
      expect(() => {
        booking.cancel(currentDate);
      }).toThrow("Booking already cancelled");
    });
  });
});
