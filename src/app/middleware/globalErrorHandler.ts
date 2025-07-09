/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";

export const globalError=(err: any, req: Request, res: Response, next: NextFunction) => {

  const statusCode=500
  const message =`something went Wrong ${err.message} `
  res.status(statusCode).json({
    success: false,
    message ,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
}