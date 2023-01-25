import { Router } from "express";
import contrUser from "../controllers/user.controler.js";
import { auth } from "../controllers/auth.js";

const userRouter = Router();
userRouter
  .get("/authtoken/:token", contrUser.TOKEN)
  .get("/users", contrUser.GET)
  .get("/user/:id", contrUser.GET)
  .post("/users", contrUser.POST)
  .post("/register", auth.CHECK)
  .put("/user/:id", contrUser.PUT)
  .delete("/user/:id", contrUser.DElETE);

export default userRouter;
