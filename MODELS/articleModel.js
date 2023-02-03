export const articleModel = {
  GETALL: "SELECT * FROM articles",
  GET: "SELECT * FROM articles where id = $1",
  GETUSER: "SELECT * FROM articles where user_id = $1",
  POST: "INSERT INTO articles (username, contact, email, password, avatar, profession, gender) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id ",
  PUT: "UPDATE articles SET username = $2 , contact = $3 , email =$4 , password = $5  , avatar = $6 , profession = $7 , gender = $8 WHERE id = $1 RETURNING id",
  DELETE: "DELETE FROM articles where id = $1 RETURNING id",
};
