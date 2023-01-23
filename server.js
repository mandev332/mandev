import cors from "cors";
import express from "express";
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.listen(PORT);
console.log("Connection:!");
