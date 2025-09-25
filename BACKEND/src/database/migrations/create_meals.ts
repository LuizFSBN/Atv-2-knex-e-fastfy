import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.timestamp('date_time').notNullable();
    
    // Indica se está dentro da dieta (true/false)
    table.boolean('is_on_diet').notNullable(); 

    // Chave estrangeira, ligando a refeição ao usuário que a criou
    table.uuid('user_id').references('id').inTable('users').notNullable();
    
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}