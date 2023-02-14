import { Client } from "pg";

const client: Client = new Client({
  user: "guilherme",
  password: "killers",
  host: "localhost",
  database: "m4_sp2_movies_extra",
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};

export { client, startDatabase };
