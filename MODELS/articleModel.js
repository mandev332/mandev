export const articleModel = {
  GETALL: "SELECT * FROM articles where permission = true",
  GET: "SELECT * FROM articles where id = $1  and permission = true",
  GETUser: "SELECT * FROM articles where id = $1  and id = $2",
  GETUSER: "SELECT * FROM articles where user_id = $1",
  POST: "INSERT INTO articles (user_id,title,description,image,hashtag) VALUES ($1,$2,$3,$4,$5) RETURNING id ",
  ADMINPOST:
    "INSERT INTO articles (user_id,title,description,image,hashtag,permission) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id ",
  PUT: "UPDATE articles SET title = $2 , description = $3, image = $4 , hashtag = $5 WHERE id = $1 RETURNING *",
  ADMINPUT: "UPDATE articles SET permission = $2  WHERE id = $1 RETURNING *",
  DELETE: "DELETE FROM articles where id = $1 RETURNING id",
};
