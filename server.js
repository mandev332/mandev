import cors from "cors";
import express from "express";
import userRouter from "./routers/user.router.js";
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(userRouter);

app.listen(PORT);
console.log("Connection:!");
