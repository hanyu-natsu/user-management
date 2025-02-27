import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

import NotFound from '../error/NotFound';
import UserAlreadyExistError from '../error/UserAlreadyExistError';
import { User } from '../models';
import UserService from '../services/UserService';

const SALT_ROUNDS = 10;

/**
 * Controller for handling user requests.
 */
export default class UserController {
  constructor(private userService: UserService) {}

  async createUser(
    request: FastifyRequest<{ Body: User & { password: string } }>,
    reply: FastifyReply,
  ) {
    const user = request.body;

    const existingUser = await this.userService.getUserByEmail(user.email);
    if (existingUser) {
      throw new UserAlreadyExistError();
    }

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    const userId = await this.userService.createUser({
      ...user,
      password: hashedPassword,
    });
    reply.code(201).send({ id: userId });
  }

  async getUsers(
    request: FastifyRequest<{
      Querystring: { page: number; limit: number; search?: string };
    }>,
    reply: FastifyReply,
  ) {
    const { page, limit, search } = request.query;
    const response = await this.userService.getUsers(page, limit, search);
    reply.send(response);
  }

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = await this.userService.getUserById(request.params.id);
    if (!user) {
      throw new NotFound();
    }
    reply.send(user);
  }

  async deleteUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await this.userService.deleteUser(request.params.id);
    reply.code(204).send();
  }

  async updateUserById(
    request: FastifyRequest<{
      Params: { id: string };
      Body: Partial<User>;
    }>,
    reply: FastifyReply,
  ) {
    let birthdate = request.body.birthdate;
    if (birthdate) {
      birthdate = new Date(birthdate);
    }
    const updatedUser = await this.userService.updateUser(request.params.id, {
      ...request.body,
      birthdate,
    });
    if (!updatedUser) {
      throw new NotFound();
    }
    reply.status(200).send(updatedUser);
  }
}
