export const userModel = {
  GETALL: "SELECT * FROM users",
  GET: "SELECT * FROM users where id = $1",
  POST: "INSERT INTO users (username,contact,email,password,avatar,profession) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
  PUT: "SELECT * FROM users where id = $1",
  DELETE: "SELECT * FROM users where id = $1",
};
