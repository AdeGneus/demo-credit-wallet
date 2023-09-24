"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email").unique().index().notNullable();
    table.string("password").checkLength(">=", 8).notNullable();
    table.timestamps(true, true);
});
exports.up = up;
const down = async (knex) => knex.schema.dropTableIfExists("users");
exports.down = down;
