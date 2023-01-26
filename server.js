import cors from "cors";
import express from "express";
import fileupload from "express-fileupload";
import userRouter from "./routers/user.router.js";
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(fileupload({ limits: { fileSize: 10 * 1024 * 1024 } }));
app.use(userRouter);
// console.log(
//   parseInt((new Date() - new Date("2023-01-26T14:00:30.228Z")) / 86400),
//   new Date(),
//   "2023-01-26T14:00:30.228Z"
// );
app.listen(PORT);
console.log("Connection:!");
