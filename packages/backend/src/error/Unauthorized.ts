import createError from '@fastify/error';

export default createError('UNAUTHORIZED', 'Invalid email or password', 401);
