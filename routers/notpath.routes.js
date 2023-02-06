import { Router } from "express";
const notPath = Router();
notPath.all("/*", (req, res) =>
  res.send({
    status: 404,
    message: "Not found path" + req.url,
  })
);

export default notPath;
