import { Router } from "express";
import kesh from "../controllers/admin.controller.js";
import { auth } from "../middlewares/auth.js";

const keshRouter = Router();
keshRouter
  .get("/", auth.TOKEN, kesh.GET)
  .get("/:id", auth.TOKEN, kesh.GET)
  .post("/", kesh.POST)
  .delete("/:id", auth.TOKEN, kesh.DELETE);
//   .put("/:id", auth.TOKEN, kesh.PUT)

export default keshRouter;
