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
  });

  context("failure", () => {
    it("should not create booking", () => {});
  });
});
