import { FastifyReply, FastifyRequest } from 'fastify';

import AuthService from '../services/AuthService';

/**
 * Controller for handling authentication requests.
 */
export default class AuthController {
  constructor(private authService: AuthService) {}

  async login(
    request: FastifyRequest<{ Body: { email: string; password: string } }>,
    reply: FastifyReply,
  ) {
    const { email, password } = request.body;
    const { accessToken, refreshToken } = await this.authService.createTokens(
      email,
      password,
    );

    // Set JWT as HTTP-only cookie

    reply
      .setCookie('token', accessToken, {
        domain: 'localhost',
        path: '/',
        secure: false, // TODO: set to true in https production
        httpOnly: true,
        sameSite: true,
      })
      .setCookie('refreshToken', refreshToken, {
        domain: 'localhost',
        path: '/',
        secure: false, // TODO: set to true in https production
        httpOnly: true,
        sameSite: true,
      })
      .code(200)
      .send();
  }

  refreshToken(
    request: FastifyRequest<{ Body: { refreshToken: string } }>,
    reply: FastifyReply,
  ) {
    const { accessToken, refreshToken } = this.authService.refreshToken(
      request.body.refreshToken,
    );
    reply
      .setCookie('token', accessToken, {
        domain: 'localhost',
        path: '/',
        secure: false, // TODO: set to true in https production
        httpOnly: true,
        sameSite: true,
      })
      .setCookie('refreshToken', refreshToken, {
        domain: 'localhost',
        path: '/',
        secure: false, // TODO: set to true in https production
        httpOnly: true,
        sameSite: true,
      })
      .code(200)
      .send();
  }

  logOut(_: FastifyRequest, reply: FastifyReply) {
    reply
      .clearCookie('accessToken', { path: '/' })
      .clearCookie('refreshToken', { path: '/' })
      .send();
  }
}
