import { Router } from "express";
import contrUser from "../controllers/user.controler.js";

const userRouter = Router();
userRouter
  .get("/users", contrUser.GET)
  .get("/user/:id", contrUser.GET)
  .post("/users", contrUser.GET)
  .put("/user/:id", contrUser.GET)
  .delete("/user/:id", contrUser.GET);

export default userRouter;
