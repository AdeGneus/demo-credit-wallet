import knex from "knex";
import knexConfig from "./knexfile";
import config from "config";

const environment = config.get<string>("NODE_ENV") ?? "development";

const db = knex(knexConfig[environment]);

export default db;
