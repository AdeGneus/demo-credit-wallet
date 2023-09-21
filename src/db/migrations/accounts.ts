import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("accounts", (table) => {
    table.increments("id").primary();
    table.float("balance").defaultTo(0.0);
    table.timestamps(true, true);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTableIfExists("accounts");
