import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  connectionString:
    "postgres://hbpbwwde:vvHuMw4EIauh2KInKMZ38RtBNyFi1LCr@satao.db.elephantsql.com/hbpbwwde",
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

async function fetchAll(query, ...params) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(query, params.length ? params : null);
    return rows;
  } catch (err) {
    return err;
  } finally {
    client.release();
  }
}

export { fetch, fetchAll };
