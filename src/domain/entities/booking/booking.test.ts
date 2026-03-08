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
  });
});
