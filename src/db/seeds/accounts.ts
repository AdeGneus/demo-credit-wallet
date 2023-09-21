import { Knex } from "knex";

export const seed = async (knex: Knex): Promise<void> => {
  // Deletes ALL existing entries
  await knex("accounts").del();

  // Inserts seed entries
  await knex("accounts").insert([
    { id: 1, balance: 2599.99 },
    { id: 2, balance: 1899.48 },
    { id: 3, balance: 0.0 },
  ]);
};
