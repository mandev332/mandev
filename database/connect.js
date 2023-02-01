import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_ENDPOINT,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT,
  connectionString: process.env.QUERYSTRING,
});

async function fetch(queryString, ...params) {
  const client = await pool.connect();
  try {
    let {
      rows: [data],
    } = await client.query(queryString, params.length ? params : null);
    return data;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}

async function fetchAll(query) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query);
    return rows;
  } catch (err) {
    return err;
  } finally {
    client.release();
  }
}

export { fetch, fetchAll };
