import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("wallets", (table) => {
    table.increments("id").primary();
    table.string("account_number").unique().checkLength("=", 10).notNullable();
    table.float("balance").notNullable().defaultTo(0.0);
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTableIfExists("wallets");
