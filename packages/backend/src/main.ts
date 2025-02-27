import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import mongodb from '@fastify/mongodb';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import Fastify from 'fastify';

import authPlugin from './plugins/authPlugin';
import diPlugin from './plugins/diPlugin';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

const app = Fastify({
  logger: true,
});

async function main() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  // Swagger Configuration
  app.register(swagger, {
    openapi: {
      info: {
        title: 'API Documentation',
        description: 'API documentation with JWT authentication',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  app.register(swaggerUI, {
    routePrefix: '/docs',
    staticCSP: true,
  });

  app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
  });
  app.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: { expiresIn: '15min' },
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });
  app.register(mongodb, {
    forceClose: true,
    url: process.env.MONGODB_URL,
  });
  app.register(diPlugin);
  app.register(authPlugin);
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(userRoutes, { prefix: '/api/user' });

  await app.listen({ port: 3000, host: '0.0.0.0' });
}

main().catch((err: unknown) => {
  app.log.error(err);
  process.exit(1);
});
