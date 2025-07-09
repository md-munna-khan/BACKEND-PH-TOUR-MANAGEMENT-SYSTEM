import express, { Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1/user",UserRoutes)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to tour Management Backend",
  });
});

export default app;
