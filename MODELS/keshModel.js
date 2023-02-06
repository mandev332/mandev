export const keshModel = {
  GETALL: "SELECT * FROM keshsite",
  GET: "SELECT * FROM keshsite where id = $1",
  POST: "INSERT INTO keshsite (username, contact, sitelink) VALUES ($1,$2,$3) RETURNING id ",
  DELETE: "DELETE FROM keshsite where id = $1 RETURNING id",
};
