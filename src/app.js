// src/app.js

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./middlewares/log.middleware.js";
import UsersRouter from "./routes/users.router.js";
import avatarRouter from "./routes/avatar.router.js";
import itemRouter from "./routes/item.router.js";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import connect from "./schemas/index.js";

const app = express();
const PORT = 4000;

connect();

app.use(LogMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", [UsersRouter]);
app.use("/api", [avatarRouter]);
app.use("/api", [itemRouter]);

app.use(errorHandlingMiddleware);

app.listen(4000, "0.0.0.0", () => {
  console.log("모든 인터페이스에서 4000 포트로 열림");
});
