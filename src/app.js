// src/app.js

import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./middlewares/log.middleware.js";
import UsersRouter from "./routes/users.router.js";
import characterRouter from "./routes/character.router.js";
import itemRouter from "./routes/item.router.js";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";

const app = express();
const PORT = 4000;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter]);
app.use("/api", [characterRouter]);
app.use("/api", [itemRouter]);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
