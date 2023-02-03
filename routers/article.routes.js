import { Router } from "express";
import { auth } from "../controllers/auth.js";
import art from "../controllers/article.controller.js";

const articleRouter = Router();
articleRouter
  .get("/articles/user", auth.TOKEN, art.GETUSER)
  .get("/articles/user/:id", auth.TOKEN, art.GETUSER)
  .get("/articles", art.GET)
  .get("/articles/:id", art.GET)
  .post("/articles", auth.TOKEN)
  .put("/articles/:id", art.PUT)
  .delete("/articles/:id", art.DELETE);

export default articleRouter;
