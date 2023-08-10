import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import contrUser from "../controllers/user.controler.js";

const userRouter = Router();
userRouter
    .get("/users", auth.TOKEN, contrUser.GET)
    .get("/users/:id", auth.TOKEN, contrUser.GET)
    .post("/gmail", auth.CHECK)
    .post("/password", auth.PASS)
    .post("/register", auth.UPLOAD, auth.REGISTER)
    .post("/login", auth.LOGIN)
    .put("/users", auth.TOKEN, auth.UPLOAD, contrUser.PUT)
    .put("/users/admin/:id", auth.TOKEN, contrUser.ADDADMIN)
    .delete("/users", auth.TOKEN, contrUser.DELETE);

export default userRouter;
