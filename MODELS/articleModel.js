export const articleModel = {
  GETALL: "SELECT * FROM articles",
  GET: "SELECT * FROM articles where id = $1",
  GETUSER: "SELECT * FROM articles where user_id = $1",
  POST: "INSERT INTO articles (user_id,title,description,image) VALUES ($1,$2,$3,$4) RETURNING id ",
  PUT: "UPDATE articles SET title = $2 , description = $3, image = $4 WHERE id = $1 RETURNING *",
  DELETE: "DELETE FROM articles where id = $1 RETURNING id",
};
