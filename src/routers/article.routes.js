import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import art from "../controllers/article.controller.js";

const articleRouter = Router();
articleRouter
  .get("/user", auth.TOKEN, art.GETUSER)
  .get("/user/:id", auth.TOKEN, art.GETUSER)
  .get("/", art.GET)
  .get("/:id", art.GET)
  // .get("/send/:id", art.GET)
  .post("/", auth.TOKEN, art.UPLOAD, art.POST)
  .put("/:id", auth.TOKEN, art.UPLOAD, art.PUT)
  .put("/like/:id", art.LIKE)
  .put("/view/:id", art.VIEW)
  .put("/admin/:id", auth.TOKEN, art.UPLOAD, art.ADMINPUT)
  .delete("/:id", auth.TOKEN, art.DELETE);

export default articleRouter;
