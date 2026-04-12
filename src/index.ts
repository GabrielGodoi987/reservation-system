import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './data-source';
import { createRepositories, createServices } from './lib/factory';
import { BookingController } from './infrastructure/web/booking/booking.controller';
import { swaggerSpecs } from './lib/swagger';

async function bootstrap() {
  console.log('Initializing database...');
  await AppDataSource.initialize();
  console.log('Database connected');

  const repositories = createRepositories(AppDataSource);
  const services = createServices(repositories);

  const bookingController = new BookingController(services.bookingService);

  const app = express();
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.post('/bookings', (req, res) => bookingController.create(req, res));
  app.get('/bookings', (req, res) => bookingController.findAll(req, res));
  app.get('/bookings/:id', (req, res) => bookingController.findOne(req, res));
  app.delete('/bookings/:id', (req, res) => bookingController.cancel(req, res));

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
}

bootstrap().catch(console.error);