import { Knex } from "knex";

export const seed = async (knex: Knex): Promise<void> => {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      password: "test1234",
      account_number: "8723672782",
      balance: 2599.99,
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "janesmith@example.com",
      password: "test1234",
      account_number: "9877452619",
      balance: 1899.48,
    },
    {
      id: 3,
      first_name: "Lorem",
      last_name: "Ipsum",
      email: "loremipsum@example.com",
      password: "test1234",
      account_number: "3748570220",
      balance: 0.0,
    },
  ]);
};
