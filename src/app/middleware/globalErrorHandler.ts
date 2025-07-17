/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/app.error";

export const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Mongoose
   * - duplicate
   * - cast error
   * - Validation error
   */
     const errorSources: any = [
    //   {
    //   path:"isDeleted",
    //   message:"cast Failed"
    // }
  ];
  let statusCode = 500;
  let message = `something went Wrong ${err.message} `;
  // Duplicate Error
  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exist`;
  }
  // Object id Error, Cast Error
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectID. Please provide A Valid Id";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);
 
    errors.forEach((errorObject: any) => errorSources.push({
      path:errorObject.path,
      message:errorObject.message
    }));
 
    message = err.message
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
