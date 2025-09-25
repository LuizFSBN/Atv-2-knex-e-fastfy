import { knex, Knex } from 'knex';
import 'dotenv/config'; // Carrega as variáveis de ambiente

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    // Usa a variável de ambiente (se definida) ou o nome padrão do arquivo de DB
    filename: process.env.DATABASE_URL || './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations', // Caminho para as migrations
  },
};

export const knexInstance = knex(config);