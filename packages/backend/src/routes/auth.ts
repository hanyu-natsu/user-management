import { FastifyInstance } from 'fastify';

import AuthController from '../controllers/AuthController';

export default function userRoutes(app: FastifyInstance) {
  const authController = new AuthController(app.diContainer.cradle.authService);

  app.post<{ Body: { email: string; password: string } }>(
    '/login',
    {
      schema: {
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
        response: {
          200: {
            description: 'Successful login',
          },
        },
      },
    },
    authController.login.bind(authController),
  );

  app.post<{ Body: { refreshToken: string } }>(
    '/refresh',
    {
      schema: {
        tags: ['auth'],
        response: {
          200: {
            description: 'Token refreshed successfully',
            type: 'null',
          },
          401: {
            description: 'Invalid refresh token',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    authController.refreshToken.bind(authController),
  );

  app.post(
    '/logout',
    {
      schema: {
        description: 'User logout',
        tags: ['auth'],
        response: {
          200: {
            description: 'Successful logout',
            type: 'null',
          },
        },
      },
    },
    authController.logOut.bind(authController),
  );
}
