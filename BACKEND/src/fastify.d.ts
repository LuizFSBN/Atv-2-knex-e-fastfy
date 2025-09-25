import 'fastify';

interface User {
  id: string; 
}
declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}