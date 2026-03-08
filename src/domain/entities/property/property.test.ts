import { context } from "../../../lib/context";
import { DateRange } from "../../value-objects/date-range/date-range";
import { BookingEntity } from "../booking/booking.entity";
import { UserEntity } from "../user/user.entity";
import { PropertyEntity } from "./property.entity";

describe("Property Entity", () => {
  context("success", () => {
    it("Should create an object with the correct atributes", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        100,
        2,
        4,
      );

      expect(property.getId()).toBe("id");
      expect(property.getName()).toBe("beach house");
      expect(property.getDescription()).toBe("a nice beach house");
      expect(property.getPrice()).toBe(100);
      expect(property.getMinGuests()).toBe(2);
      expect(property.getMaxGuests()).toBe(4);
    });
  });

  context("failure", () => {
    it("Should throw an error if the name is empty", () => {
      expect(() => {
        new PropertyEntity("id", "", "a nice beach house", 100, 2, 4);
      }).toThrow("Name cannot be empty");
    });

    it("Should thrown an error if name is null or undefined", () => {
      expect(() => {
        new PropertyEntity("id", null as any, "a nice beach house", 100, 2, 4);
      }).toThrow("Name cannot be empty");

      expect(() => {
        new PropertyEntity(
          "id",
          undefined as any,
          "a nice beach house",
          100,
          2,
          4,
        );
      }).toThrow("Name cannot be empty");
    });

    it("Should thrown an error if maxGuests is zero or negative", () => {
      expect(() => {
        new PropertyEntity(
          "id",
          "beach house",
          "a nice beach house",
          100,
          2,
          -1,
        );
      }).toThrow("Max guests cannot be negative");

      expect(() => {
        new PropertyEntity(
          "id",
          "beach house",
          "a nice beach house",
          100,
          2,
          0,
        );
      }).toThrow("Max guests cannot be zero");
    });

    it("Should throw an error if the max number of guests is exceeded", () => {
      const property = new PropertyEntity(
        "id",
        "beach house",
        "a nice beach house",
        100,
        2,
        4,
      );

      expect(() => {
        property.validateGuestCount(6);
      }).toThrow("Max guests exceeded");
    });
  });

  context("Important business rules - test", () => {
    context("success", () => {
      it("Should apply 10% discount for reservations with 7 or more nights", () => {
        const property = new PropertyEntity(
          "id",
          "beach house",
          "a nice beach house",
          100, // price per night
          2,
          4,
        );

        const dateRange1 = new DateRange(
          new Date("2026-01-01"),
          new Date("2026-01-11"),
        );

        const dateRange2 = new DateRange(
          new Date("2026-01-01"),
          new Date("2026-01-08"),
        );

        const totalPriceReservation1 = property.calculateTotalPrice(dateRange1);

        const totalPriceReservation3 = property.calculateTotalPrice(dateRange2);

        expect(totalPriceReservation1).toBe(900);
        expect(totalPriceReservation3).toBe(630);
      });

      it("Sould not apply discount for reservations with less than 7 nights", () => {
        const property = new PropertyEntity(
          "id",
          "beach house",
          "a nice beach house",
          100,
          2,
          4,
        );

        const dateRange2 = new DateRange(
          new Date("2026-01-01"),
          new Date("2026-01-06"),
        );

        const totalPriceReservation2 = property.calculateTotalPrice(dateRange2);

        expect(totalPriceReservation2).toBe(500);
      });
    });

    // context("failure", () => {
    // it("Should throw an error if the number of nights is zero or negative", () => {
    //   const property = new PropertyEntity(
    //     "id",
    //     "beach house",
    //     "a nice beach house",
    //     100,
    //     2,
    //     4,
    //     false,
    //   );
    //   const dateRange2 = new DateRange(
    //     new Date("2026-01-01"),
    //     new Date("2026-01-08"),
    //   );
    //   expect(() => {
    //     property.calculateTotalPrice(0);
    //   }).toThrow("Number of nights must be greater than zero");
    //   expect(() => {
    //     property.calculateTotalPrice(-1);
    //   }).toThrow("Number of nights must be greater than zero");
    // });
    //});
  });

  context("Booking a property cases", () => {
    context("success", () => {
      it("Should return false for availability of a booked property", () => {
        const property = new PropertyEntity(
          "id",
          "Penthouse",
          "A nice penthouse in front of the beach",
          250,
          2,
          4,
        );

        const user = new UserEntity("id", "John Doe");

        const dateRange1 = new DateRange(
          new Date("2026-01-01"),
          new Date("2026-01-10"),
        );

        const dateRange2 = new DateRange(
          new Date("2026-01-05"),
          new Date("2026-01-15"),
        );

        // booked with dateRange1
        // now its not available for dateRange2, because it overlaps with dateRange1
        expect(property.isAvailable(dateRange1)).toBe(true);

        const booking = new BookingEntity("id", property, user, dateRange1, 2);
        property.addBooking(booking);

        expect(property.isAvailable(dateRange2)).toBe(false);
      });

      it("Should return true for availability of a non-booked property", () => {
        const property = new PropertyEntity(
          "id",
          "Penthouse",
          "A nice penthouse in front of the beach",
          250,
          2,
          4,
        );

        const dateRange = new DateRange(
          new Date("2026-01-01"),
          new Date("2026-01-10"),
        );

        const dateRange2 = new DateRange(
          new Date("2026-01-11"),
          new Date("2026-01-20"),
        );

        expect(property.isAvailable(dateRange)).toBe(true);
      });
    });
  });
});
