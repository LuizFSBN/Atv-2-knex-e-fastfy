import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { knexInstance } from '../database/knex';

export async function usersRoutes(app: FastifyInstance) {
  
  [cite_start]
  app.post('/', async (request, reply) => {
    
    const userId = randomUUID(); 
    
    await knexInstance('users').insert({
      id: userId,
    });

    reply.cookie('session_id', userId, {
      path: '/', 
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return reply.status(201).send({
        message: 'Usuário criado com sucesso.',
        userId,
    });
  });
}