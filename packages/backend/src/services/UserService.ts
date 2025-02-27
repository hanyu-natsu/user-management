import { JWT } from '@fastify/jwt';
import bcrypt from 'bcrypt';
import { Db, MongoError, ObjectId } from 'mongodb';

import Unauthorized from '../error/Unauthorized';
import UserAlreadyExistError from '../error/UserAlreadyExistError';
import { User } from '../models';

/**
 * User CRUD service.
 */
export default class UserService {
  private jwt: JWT;
  private mongo: Db;

  constructor({ jwt, mongo }: { jwt: JWT; mongo: Db }) {
    this.jwt = jwt;
    this.mongo = mongo;
  }

  async getUsers(page: number, limit: number, search?: string) {
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const collection = this.mongo.collection<User>('user');

    const total = await collection.countDocuments(filter);

    const results = await this.mongo
      .collection<User>('user')
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    return {
      results,
      total,
      page,
      limit,
    };
  }

  async getUserById(id: string) {
    return await this.mongo
      .collection<User>('user')
      .findOne({ _id: new ObjectId(id) });
  }

  async getUserByEmail(email: string) {
    return await this.mongo.collection<User>('user').findOne({ email });
  }

  async getJwt(email: string, password: string) {
    const user = await this.mongo
      .collection<User & { password: string }>('user')
      .findOne({ email });

    if (!user) {
      throw new Unauthorized();
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Unauthorized();
    }

    return this.jwt.sign({ id: user._id, email: user.email });
  }

  async createUser(user: User & { password: string }) {
    try {
      const result = await this.mongo.collection('user').insertOne(user);
      return result.insertedId;
    } catch (error: unknown) {
      const mongoError = error as MongoError;
      if (mongoError.code === 11000) {
        throw new UserAlreadyExistError();
      }
      throw error;
    }
  }

  async deleteUser(id: string) {
    await this.mongo.collection('user').deleteOne({ _id: new ObjectId(id) });
  }

  async updateUser(id: string, user: Partial<User>) {
    const updated = await this.mongo
      .collection<User>('user')
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: user });
    return updated;
  }
}
