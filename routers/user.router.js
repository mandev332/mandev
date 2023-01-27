import { Router } from "express";
import contrUser from "../controllers/user.controler.js";
import { auth } from "../controllers/auth.js";

const userRouter = Router();
userRouter
  .get("/users", contrUser.GET)
  .get("/user/:id", contrUser.GET)
  .post("/users", contrUser.POST)
  .post("/gmail", auth.CHECK)
  .post("/password", auth.PASS)
  .post("/register", auth.REGISTER)
  .post("/login", auth.LOGIN)
  .put("/user/:id", contrUser.PUT)
  .delete("/user/:id", contrUser.DELETE);

export default userRouter;
