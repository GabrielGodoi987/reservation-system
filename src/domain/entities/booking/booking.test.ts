import { context } from "../../../lib/context";
import { DateRange } from "../../value-objects/date-range/date-range";
import { PropertyEntity } from "../property/property.entity";
import { UserEntity } from "../user/user.entity";
import { BookingEntity } from "./booking.entity";

describe("Booking entity", () => {
  context("success", () => {
    it("Should criate an booking object with all attributes", () => {
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
  });
});
