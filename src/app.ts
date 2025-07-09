import express, { Request, Response } from "express";

import cors from "cors";
import { router } from "./app/modules/routes";

import { globalError } from "./app/middleware/globalErrorHandler";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to tour Management Backend",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalError);

export default app;
