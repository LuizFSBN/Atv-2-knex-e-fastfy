// src/middlewares/check-session-id.ts

import { FastifyReply, FastifyRequest } from 'fastify';

// CORREÇÃO FINAL: Use a sintaxe 'require' do CommonJS para módulos que estão 
// gerando erro em caminhos relativos complexos.
const { knexInstance } = require('../database/knex.ts'); 

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // O código restante está correto
  const { session_id } = request.cookies;

  if (!session_id) {
    return reply.status(401).send({
      error: 'Não Autorizado: ID de Sessão ausente.',
    });
  }

  // Busca o usuário no banco
  const user = await knexInstance('users')
    .where('id', session_id) 
    .first();

  if (!user) {
    return reply.status(401).send({
      error: 'Não Autorizado: ID de Sessão inválido.',
    });
  }

  request.user = user;
}