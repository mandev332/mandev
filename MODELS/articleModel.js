export const articleModel = {
  GETALL:
    "SELECT a.id as art_id, a.title, a.description, a.likes,a.views,a.add_date,u.username,u.avatar,u.profession,u.id user_id,count(c.id) comm\
        FROM articles as a \
        INNER JOIN users as u ON (a.user_id = u.id)\
        INNER JOIN comments as c ON (a.id = c.art_id)\
        where a.permission = true\
        GROUP BY a.id , u.username, u.avatar,u.profession,u.id",
  GET: "SELECT a.id as art_id, a.title, a.description, a.likes,a.views,a.add_date,u.username,u.avatar,u.profession,u.id user_id,count(c.id) comm\
        FROM articles as a \
        INNER JOIN users as u ON (a.user_id = u.id)\
        INNER JOIN comments as c ON (a.id = c.art_id)\
        where a.permission = true and id = $1\
        GROUP BY a.id , u.username, u.avatar,u.profession,u.id",
  GETUSER: "SELECT * FROM articles where user_id = $1",
  GETUser: "SELECT * FROM articles where user_id = $1 and id = $2",
  POST: "INSERT INTO articles (user_id,title,description,image,hashtag) VALUES ($1,$2,$3,$4,$5) RETURNING id ",
  ADMINPOST:
    "INSERT INTO articles (user_id,title,description,image,hashtag,permission) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id ",
  PUT: "UPDATE articles SET title = $2 , description = $3, image = $4 , hashtag = $5 WHERE id = $1 RETURNING *",
  LIKE: "UPDATE articles SET likes = likes + 1 WHERE id = $1 RETURNING *",
  VIEW: "UPDATE articles SET views = views + 1 WHERE id = $1 RETURNING *",
  ADMINPUT:
    "UPDATE articles SET  permission = $2 , add_date = $3 WHERE id = $1 RETURNING *",
  DELETE: "DELETE FROM articles where id = $1 RETURNING id",
};
