import { JWT } from '@fastify/jwt';
import bcrypt from 'bcrypt';
import { Db } from 'mongodb';

import Unauthorized from '../error/Unauthorized';
import { User } from '../models';

/**
 * Service for handling authentication and JWT creation.
 */
export default class AuthService {
  private jwt: JWT;
  private mongo: Db;

  constructor({ jwt, mongo }: { jwt: JWT; mongo: Db }) {
    this.jwt = jwt;
    this.mongo = mongo;
  }

  async createTokens(email: string, password: string) {
    const user = await this.mongo
      .collection<User & { password: string }>('user')
      .findOne({ email });

    if (!user) {
      throw new Unauthorized();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Unauthorized();
    }

    const accessToken = this.jwt.sign({ id: user._id, email });
    const refreshToken = this.jwt.sign(
      { id: user._id, email },
      { expiresIn: '7d' }, // Refresh token expiration (e.g., 7 days)
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  refreshToken(refreshToken: string) {
    const decoded = this.jwt.verify<{ id: string; email: string }>(
      refreshToken,
    );

    const accessToken = this.jwt.sign({
      id: decoded.id,
      email: decoded.email,
    });
    const newRefreshToken = this.jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
      },
      { expiresIn: '7d' },
    );
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
