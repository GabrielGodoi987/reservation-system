import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reservation System API',
      version: '1.0.0',
      description: 'API for managing bookings, properties, and users',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            property: { type: 'object' },
            guest: { type: 'object' },
            dateRange: { type: 'object' },
            guestsNumber: { type: 'number' },
            status: { type: 'string' },
            totalPrice: { type: 'number' },
          },
        },
        CreateBookingDto: {
          type: 'object',
          required: ['propertyId', 'guestId', 'startDate', 'endDate', 'guestCount'],
          properties: {
            propertyId: { type: 'string' },
            guestId: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            guestCount: { type: 'number' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/bookings': {
        get: {
          summary: 'Get all bookings',
          responses: {
            '200': {
              description: 'List of bookings',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Booking' },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new booking',
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateBookingDto' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Created booking',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Booking' },
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/bookings/{id}': {
        get: {
          summary: 'Get a booking by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Booking found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Booking' },
                },
              },
            },
            '404': {
              description: 'Booking not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Cancel a booking',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '204': {
              description: 'Booking cancelled',
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/index.ts'],
};

export const swaggerSpecs = swaggerJsdoc(options);