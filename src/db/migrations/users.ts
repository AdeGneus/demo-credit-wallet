import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email").unique().index().notNullable();
    table.string("password").checkLength(">=", 8).notNullable();
    table.string("account_number").unique().checkLength("=", 10).notNullable();
    table.float("balance").defaultTo(0.0);
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTableIfExists("users");
