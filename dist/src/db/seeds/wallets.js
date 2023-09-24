"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = void 0;
const seed = async (knex) => {
    // Deletes ALL existing entries
    await knex("wallets").del();
    // Inserts seed entries
    await knex("wallets").insert([
        {
            id: 1,
            balance: 4523.08,
            account_number: "4863323275",
            user_id: 1,
        },
        {
            id: 2,
            balance: 1538.66,
            account_number: "9354788134",
            user_id: 2,
        },
        {
            id: 3,
            balance: 33673.0,
            account_number: "8887102612",
            user_id: 3,
        },
    ]);
};
exports.seed = seed;
