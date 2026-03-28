import { context } from "../../../../src/lib/context";
import { BookingEntity } from "../../../domain/entities/booking/booking.entity";
import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { FakeBookingRepository } from "../../../infrastructure/repositories/booking/fake-booking.repository";
import { PropertyService } from "../../services/property/property.service";
import { UserService } from "../../services/user/user.service";
import { BookingService } from "../booking/booking.service";
import { CreateBookingDto } from "../booking/dto/create-booking.dto";

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

      mockPropertyService.findById.mockResolvedValue(mockProperty);
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await bookingService.create(bookingDto);

      expect(result).toBeInstanceOf(BookingEntity);
      expect(result.getStatus()).toBe(BookingStatus.CONFIRMED);
      expect(result.getTotalPrice()).toBe(500);

      const savedBooking = await repository.findOne(result.getId());

      expect(savedBooking).not.toBeNull();
      expect(savedBooking?.getId()).toBe(result.getId());
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

      mockPropertyService.findById.mockResolvedValue(mockProperty);
      mockUserService.findById.mockResolvedValue(mockUser);

      const booking = await bookingService.create(bookingDto);

      const findByIdSpy = jest.spyOn(
        FakeBookingRepository.prototype,
        "findOne",
      );

      const saveSpy = jest.spyOn(FakeBookingRepository.prototype, "save");

      await bookingService.cancel(booking.getId());

      const canceledBooking = await bookingService.findOne(booking.getId());

      expect(canceledBooking?.getStatus()).toBe(BookingStatus.CANCELED);
      expect(findByIdSpy).toHaveBeenCalledWith(booking.getId());
      expect(findByIdSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  context("failure", () => {
    it("should not create booking when property not found", async () => {
      mockPropertyService.findById.mockResolvedValue(null);

      await expect(bookingService.create({} as any)).rejects.toThrow(
        "Property not found",
      );
    });

    it("should throw an error when user is not found", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(true),
        validateGuestCount: jest.fn(),
        calculateTotalPrice: jest.fn().mockReturnValue(500),
        addBooking: jest.fn(),
      } as any;

      mockPropertyService.findById.mockResolvedValue(mockProperty);
      mockUserService.findById.mockResolvedValue(null);

      await expect(bookingService.create({} as any)).rejects.toThrow(
        "User not found",
      );
    });

    it("should throw an error when property is not available", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(false),
      } as any;

      const mockUser = {
        getId: jest.fn().mockReturnValue("1"),
      } as any;

      mockPropertyService.findById.mockResolvedValue(mockProperty);
      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(bookingService.create({} as any)).rejects.toThrow(
        "Property not available",
      );
    });

    it.only("should throw an error when trying to book in unavailable period", async () => {
      const mockProperty = {
        getId: jest.fn().mockReturnValue("1"),
        isAvailable: jest.fn().mockReturnValue(false), // ✅ aqui está a regra
        validateGuestCount: jest.fn(),
        calculateTotalPrice: jest.fn(),
        addBooking: jest.fn(),
      } as any;

      const mockUser = {
        getId: jest.fn().mockReturnValue("1"),
      } as any;

      const createBookingDto: CreateBookingDto = {
        propertyId: "1",
        guestId: "1",
        startDate: new Date("2026-05-05"),
        endDate: new Date("2026-05-25"),
        guestCount: 2,
      };

      mockPropertyService.findById.mockResolvedValue(mockProperty);
      mockUserService.findById.mockResolvedValue(mockUser);

      await expect(bookingService.create(createBookingDto)).rejects.toThrow(
        "Property is not available for selected date range",
      );
    });
  });
});
