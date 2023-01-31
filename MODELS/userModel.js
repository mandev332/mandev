export const userModel = {
  LOGIN: "SELECT * FROM users where email = $1 and password = $2",
  GETALL: "SELECT * FROM users",
  GET: "SELECT * FROM users where id = $1",
  POST: "INSERT INTO users (username, contact, email, password, avatar, profession, gender) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING * ",
  PUT: "UPDATE users SET username = $2 , contact = $3 , email =$4 , password = $5  , avatar = $6 , profession = $7 , gender = $8 WHERE id = $1 RETURNING id",
  DELETE: "SELECT * FROM users where id = $1",
};
