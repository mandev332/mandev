import cors from "cors";
import path from "path";
import express from "express";
import fileupload from "express-fileupload";
import userRouter from "./routers/user.routes.js";
import articleRouter from "./routers/article.routes.js";
import siteRouter from "./routers/site.routes.js";
import keshRouter from "./routers/sendMessage.routes.js";
import notPath from "./routers/notpath.routes.js";
import fileRouter from "./routers/upl.routes.js";
import swagger from "./swagger/swagger.js";
const app = express();
const PORT = process.env.PORT || 5050;
app.use(cors("*"));

app.use(express.json());
app.use(fileupload({ limits: { fileSize: 10 * 1024 * 1024 } }));
app.use(swagger);
app.use(
    "/avatarka",
    express.static(path.join(process.cwd(), "src", "avatarka"))
);
app.use("/articles", articleRouter);
app.use("/sites", siteRouter);
app.use("/message", keshRouter);
app.use("/file", fileRouter);
app.use(userRouter);
app.use(notPath);
app.listen(PORT);
console.log("Connection:!", "http://localhost:" + PORT);
