import { FastifyInstance } from 'fastify';

import UserController from '../controllers/UserController';
import { User } from '../models';

const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    birthdate: { type: 'string', format: 'date' },
  },
  required: ['_id', 'firstName', 'lastName', 'email', 'birthdate'],
} as const;

export default function userRoutes(app: FastifyInstance) {
  const userController = new UserController(app.diContainer.cradle.userService);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  app.addHook('preHandler', app.authenticate);

  app.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
          },
          additionalProperties: false,
        },
        response: {
          200: {
            type: 'object',
            properties: {
              results: {
                type: 'array',
                items: userSchema,
              },
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
            },
          },
          404: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    userController.getUsers.bind(userController),
  );

  app.get(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          },
          required: ['id'],
        },
        response: {
          200: userSchema,
          404: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    userController.getUserById.bind(userController),
  );

  app.post<{ Body: User & { password: string } }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'birthdate'],
          properties: {
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: {
              type: 'string',
              minLength: 8,
              pattern:
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
              description:
                'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.',
            },
            birthdate: { type: 'string', format: 'date' },
          },
          additionalProperties: false,
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    },
    userController.createUser.bind(userController),
  );

  app.delete(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          },
          required: ['id'],
        },
        response: {
          204: {
            description: 'User successfully deleted',
            type: 'null',
          },
          404: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    userController.deleteUserById.bind(userController),
  );

  app.put<{
    Params: { id: string };
    Body: Partial<User>;
  }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            birthdate: { type: 'string', format: 'date' },
          },
          additionalProperties: false,
        },
        response: {
          200: userSchema,
          404: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    userController.updateUserById.bind(userController),
  );
}
