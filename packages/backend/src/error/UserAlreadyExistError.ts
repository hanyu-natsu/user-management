import createError from '@fastify/error';

export default createError('USER_ALREADY_EXISTS', 'User already exists', 400);
