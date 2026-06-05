import { Pool, types } from "pg";

types.setTypeParser(1114, (val: string) => val + "Z");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
