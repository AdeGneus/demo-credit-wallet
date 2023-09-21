import { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email').notNullable().unique();
    table.string('password').checkLength('>=', 8).notNullable();
    table.integer('account_number').unsigned().unique().notNullable();
    table.foreign('account_number').references('accounts.id');
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTableIfExists('users');
