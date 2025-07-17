import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/modules/routes";


import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session"
import "./app/config/passport"
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";

const app = express();


app.use(expressSession({
  secret:"your secret",
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to tour Management Backend",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler);
app.use(notFound);
export default app;
