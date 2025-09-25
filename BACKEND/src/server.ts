
import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { knexInstance } from './knex'; 
import { usersRoutes } from './routes/users';
import { mealsRoutes } from './routes/meals';
import 'dotenv/config'; 

const app = fastify();

app.register(cookie);

app.register(usersRoutes, { prefix: 'users' });
app.register(mealsRoutes, { prefix: 'meals' });


async function start() {
  try {
    console.log('Executando Migrations do Banco de Dados...');
    await knexInstance.migrate.latest();
    console.log('Migrations concluídas.');
    
    const port = Number(process.env.PORT) || 3333;
    await app.listen({ port });
    
    console.log(`Servidor HTTP rodando em http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();