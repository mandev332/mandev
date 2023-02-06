export const siteModel = {
  GETALL: "SELECT * FROM sites",
  GET: "SELECT * FROM sites where id = $1",
  POST: "INSERT INTO sites ( name , link, author, image , contact, hashtag ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id ",
  PUT: "UPDATE sites SET name = $2 , link = $3, author = $4, image = $5, contact = $6, hashtag = $7  WHERE id = $1 RETURNING *",
  DELETE: "DELETE FROM sites where id = $1 RETURNING id",
};
