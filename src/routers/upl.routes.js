import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import file from "../controllers/file.controller.js";

const fileRouter = Router();
fileRouter
  .post("/", auth.TOKEN, file.POST)
  .delete("/", auth.TOKEN, file.DELETE);

export default fileRouter;
