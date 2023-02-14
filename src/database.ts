import { Client } from "pg";

const client: Client = new Client({
  user: "YOUR_USER",
  password: "YOUR_PASSWORD",
  host: "localhost",
  database: "movies_list",
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};

export { client, startDatabase };
