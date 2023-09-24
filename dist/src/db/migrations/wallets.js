"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => knex.schema.createTable("wallets", (table) => {
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
exports.up = up;
const down = async (knex) => knex.schema.dropTableIfExists("wallets");
exports.down = down;
