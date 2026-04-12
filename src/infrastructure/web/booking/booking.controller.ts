import { Request, Response } from 'express';
import { Either, isLeft, fold } from '../../../lib/either';
import { IBookingService } from '../../../application/interfaces/booking-service.interface';
import { AppError } from '../../../lib/either';

export class BookingController {
  constructor(private readonly bookingService: IBookingService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { propertyId, guestId, startDate, endDate, guestCount } = req.body;

    const result = await this.bookingService.create({
      propertyId,
      guestId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount,
    });

    return fold<AppError, any, Response>(
      result,
      (error) => this.handleError(res, error),
      (booking) => res.status(201).json(booking)
    );
  }

  async findAll(_req: Request, res: Response): Promise<Response> {
    const result = await this.bookingService.findAll();

    return fold<AppError, any, Response>(
      result,
      (error) => this.handleError(res, error, 500),
      (bookings) => res.json(bookings)
    );
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const result = await this.bookingService.findOne(id);

    return fold<AppError, any, Response>(
      result,
      (error) => this.handleError(res, error),
      (booking) => res.json(booking)
    );
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const result = await this.bookingService.cancel(id);

    return fold<AppError, void, Response>(
      result,
      (error) => this.handleError(res, error, 500),
      () => res.status(204).send()
    );
  }

  private handleError(res: Response, error: AppError, statusCode = 400): Response {
    const statusMap: Record<string, number> = {
      NotFoundError: 404,
      ValidationError: 400,
      DatabaseError: 500,
    };

    const status = statusMap[error._tag] || statusCode;
    return res.status(status).json({ error: error.message });
  }
}