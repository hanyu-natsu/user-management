import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix';
import { JWT } from '@fastify/jwt';
import { asClass, asFunction } from 'awilix';
import fp from 'fastify-plugin';
import { Db } from 'mongodb';

import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

declare module '@fastify/awilix' {
  interface Cradle {
    mongo: Db;
    jwt: JWT;
    authService: AuthService;
    userService: UserService;
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export default fp(async (app) => {
  app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  });

  diContainer.register({
    jwt: asFunction(() => app.jwt).singleton(),
    authService: asClass(AuthService).singleton(),
    userService: asClass(UserService).singleton(),
  });

  if (app.mongo.db) {
    diContainer.register({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mongo: asFunction(() => app.mongo.db!).singleton(),
    });
  }
});
