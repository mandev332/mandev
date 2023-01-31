import { Router } from "express";
import { auth } from "../controllers/auth.js";
import contrUser from "../controllers/user.controler.js";

const userRouter = Router();
userRouter
  .get("/users", contrUser.GET)
  .get("/user/:id", contrUser.GET)
  .post("/gmail", auth.CHECK)
  .post("/password", auth.PASS)
  .post("/register", auth.UPLOAD, auth.REGISTER)
  .post("/login", auth.LOGIN)
  .put("/users", auth.TOKEN, auth.UPLOAD, contrUser.PUT)
  .delete("/user/:id", contrUser.DELETE);

export default userRouter;
