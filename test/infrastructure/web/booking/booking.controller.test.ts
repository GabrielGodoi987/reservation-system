import request from 'supertest';
import express, { Express } from 'express';
import { BookingController } from '../../../../src/infrastructure/web/booking/booking.controller';
import { BookingService } from '../../../../src/application/services/booking/booking.service';
import { PropertyEntity } from '../../../../src/domain/entities/property/property.entity';
import { UserEntity } from '../../../../src/domain/entities/user/user.entity';
import { DateRange } from '../../../../src/domain/value-objects/date-range/date-range';
import { right, left, notFound, AppError } from '../../../../src/lib/either';

describe('BookingController', () => {
  let app: Express;
  let controller: BookingController;
  let mockBookingService: jest.Mocked<BookingService>;

  beforeAll(() => {
    mockBookingService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      cancel: jest.fn(),
    } as any;

    controller = new BookingController(mockBookingService);

    app = express();
    app.use(express.json());
    app.post('/bookings', (req, res) => controller.create(req, res));
    app.get('/bookings', (req, res) => controller.findAll(req, res));
    app.get('/bookings/:id', (req, res) => controller.findOne(req, res));
    app.delete('/bookings/:id', (req, res) => controller.cancel(req, res));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /bookings', () => {
    it('Should create a booking successfully', async () => {
      const property = new PropertyEntity('prop-1', 'Beach House', 'Desc', 200, 2, 6);
      const user = new UserEntity('user-1', 'John Doe');
      const dateRange = new DateRange(new Date(2026, 3, 1), new Date(2026, 3, 5));
      const booking = { id: 'booking-1', property, guest: user, dateRange, guestsNumber: 2 };

      mockBookingService.create.mockResolvedValue(right(booking as any));

      const response = await request(app)
        .post('/bookings')
        .send({
          propertyId: 'prop-1',
          guestId: 'user-1',
          startDate: '2026-04-01',
          endDate: '2026-04-05',
          guestCount: 2,
        });

      expect(response.status).toBe(201);
      expect(mockBookingService.create).toHaveBeenCalledWith({
        propertyId: 'prop-1',
        guestId: 'user-1',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-05'),
        guestCount: 2,
      });
    });

    it('Should return 400 when service returns error', async () => {
      mockBookingService.create.mockResolvedValue(left(notFound('Property not found')));

      const response = await request(app)
        .post('/bookings')
        .send({
          propertyId: 'prop-1',
          guestId: 'user-1',
          startDate: '2026-04-01',
          endDate: '2026-04-05',
          guestCount: 2,
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Property not found');
    });
  });

  describe('GET /bookings', () => {
    it('Should return all bookings', async () => {
      const bookings = [{ id: 'booking-1' }, { id: 'booking-2' }];
      mockBookingService.findAll.mockResolvedValue(right(bookings as any));

      const response = await request(app).get('/bookings');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(bookings);
    });

    it('Should return 500 when service returns error', async () => {
      mockBookingService.findAll.mockResolvedValue(left({ _tag: 'DatabaseError', message: 'Database error' }));

      const response = await request(app).get('/bookings');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /bookings/:id', () => {
    it('Should return a booking by id', async () => {
      const booking = { id: 'booking-1' };
      mockBookingService.findOne.mockResolvedValue(right(booking as any));

      const response = await request(app).get('/bookings/booking-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(booking);
    });

    it('Should return 404 when booking not found', async () => {
      mockBookingService.findOne.mockResolvedValue(left(notFound('Booking was not found')));

      const response = await request(app).get('/bookings/booking-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Booking was not found');
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('Should cancel a booking successfully', async () => {
      mockBookingService.cancel.mockResolvedValue(right(undefined));

      const response = await request(app).delete('/bookings/booking-1');

      expect(response.status).toBe(204);
      expect(mockBookingService.cancel).toHaveBeenCalledWith('booking-1');
    });

    it('Should return 500 when service returns error', async () => {
      mockBookingService.cancel.mockResolvedValue(left({ _tag: 'DatabaseError', message: 'Cancel failed' }));

      const response = await request(app).delete('/bookings/booking-1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Cancel failed');
    });
  });
});