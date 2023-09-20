import type { Knex } from "knex";
import config from "config";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql",
    connection: {
      host: config.get<string>("DB_HOST"),
      user: config.get<string>("DB_USER"),
      password: config.get<string>("DB_PASSWORD"),
      database: config.get<string>("DB_NAME"),
    },
    migrations: {
      directory: "./db/migrations",
      extension: "ts",
    },
  },
};

export default knexConfig;
