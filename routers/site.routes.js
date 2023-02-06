import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import site from "../controllers/site.controller.js";

const siteRouter = Router();
siteRouter
  .get("/:id", site.GET)
  .get("/", site.GET)
  .post("/", auth.TOKEN, site.UPLOAD, site.POST)
  .put("/:id", auth.TOKEN, site.UPLOAD, site.PUT)
  .delete("/:id", auth.TOKEN, site.DELETE);

export default siteRouter;
