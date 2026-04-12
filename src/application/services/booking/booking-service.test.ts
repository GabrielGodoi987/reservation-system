import { context } from "@/lib/context";
import { BookingEntity } from "@/domain/entities/booking/booking.entity";
import { BookingStatus } from "@/domain/enums/booking-status.enum";
import { FakeBookingRepository } from "@/infrastructure/repositories/fake-database/booking/fake-booking.repository";
import { PropertyService } from "@/application/services/property/property.service";
import { UserService } from "@/application/services/user/user.service";
import { BookingService } from "@/application/services/booking/booking.service";
import { CreateBookingDto } from "@/application/services/booking/dto/create-booking.dto";
import { right, left, notFound } from "@/lib/either";

jest.mock("../property/property.service");
jest.mock("../user/user.service");

describe("BookingService", () => {
  let repository: FakeBookingRepository;
  let bookingService: BookingService;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeAll(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;

    mockPropertyService = new PropertyService(
      mockPropertyRepository,
    ) as jest.Mocked<PropertyService>;

    mockUserService = new UserService(
      mockUserRepository,
    ) as jest.Mocked<UserService>;

    repository = new FakeBookingRepository();

    bookingService = new BookingService(
      repository,
      mockPropertyService,
      mockUserService,
    );
  });

  context("success", () => {
    it("should create a new booking", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(true),
        validateGuestCount: jest.fn(),
        calculateTotalPrice: jest.fn().mockReturnValue(500),
        addBooking: jest.fn(),
      } as any;

      const mockUser = {
        getId: jest.fn().mockReturnValue("1"),
      } as any;

      const bookingDto: CreateBookingDto = {
        propertyId: "1",
        guestId: "1",
        startDate: new Date("2026-05-05"),
        endDate: new Date("2026-05-25"),
        guestCount: 2,
      };

      mockPropertyService.findById.mockResolvedValue(right(mockProperty));
      mockUserService.findById.mockResolvedValue(right(mockUser));

      const result = await bookingService.create(bookingDto);

      expect(result._tag).toBe("Right");
      if (result._tag === "Right") {
        expect(result.right).toBeInstanceOf(BookingEntity);
        expect(result.right.getStatus()).toBe(BookingStatus.CONFIRMED);
        expect(result.right.getTotalPrice()).toBe(500);

        const savedBooking = await repository.findOne(result.right.getId());
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(result.right.getId());
      }
    });

    it("should cancel an existent booking", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(true),
        validateGuestCount: jest.fn(),
        calculateTotalPrice: jest.fn().mockReturnValue(500),
        addBooking: jest.fn(),
      } as any;

      const mockUser = {
        getId: jest.fn().mockReturnValue("1"),
      } as any;

      const bookingDto: CreateBookingDto = {
        propertyId: "1",
        guestId: "1",
        startDate: new Date("2026-05-05"),
        endDate: new Date("2026-05-25"),
        guestCount: 2,
      };

      mockPropertyService.findById.mockResolvedValue(right(mockProperty));
      mockUserService.findById.mockResolvedValue(right(mockUser));

      const createResult = await bookingService.create(bookingDto);
      
      if (createResult._tag === "Left") return;
      
      const booking = createResult.right;

      const findByIdSpy = jest.spyOn(
        FakeBookingRepository.prototype,
        "findOne",
      );

      const saveSpy = jest.spyOn(FakeBookingRepository.prototype, "save");

      await bookingService.cancel(booking.getId());

      const canceledBooking = await bookingService.findOne(booking.getId());

      expect(canceledBooking._tag).toBe("Right");
      if (canceledBooking._tag === "Right") {
        expect(canceledBooking.right.getStatus()).toBe(BookingStatus.CANCELED);
        expect(findByIdSpy).toHaveBeenCalledWith(booking.getId());
        expect(findByIdSpy).toHaveBeenCalledTimes(2);
        expect(saveSpy).toHaveBeenCalledTimes(1);
      }
    });
  });

  context("failure", () => {
    it("should return error when property not found", async () => {
      mockPropertyService.findById.mockResolvedValue(left(notFound("Property not found")));

      const result = await bookingService.create({} as any);

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left.message).toBe("Property not found");
      }
    });

    it("should return error when user is not found", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(true),
        validateGuestCount: jest.fn(),
        calculateTotalPrice: jest.fn().mockReturnValue(500),
        addBooking: jest.fn(),
      } as any;

      mockPropertyService.findById.mockResolvedValue(right(mockProperty));
      mockUserService.findById.mockResolvedValue(left(notFound("User not found")));

      const result = await bookingService.create({} as any);

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left.message).toBe("User not found");
      }
    });

    it("should return error when property is not available", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(false),
      } as any;

      const mockUser = {
        getId: jest.fn().mockReturnValue("1"),
      } as any;

      const bookingDto: CreateBookingDto = {
        propertyId: "1",
        guestId: "1",
        startDate: new Date("2026-05-05"),
        endDate: new Date("2026-05-25"),
        guestCount: 2,
      };

      mockPropertyService.findById.mockResolvedValue(right(mockProperty));
      mockUserService.findById.mockResolvedValue(right(mockUser));

      const result = await bookingService.create(bookingDto);

      expect(result._tag).toBe("Left");
      if (result._tag === "Left") {
        expect(result.left.message).toBe("Property is not available for selected date range");
      }
    });
  });
});