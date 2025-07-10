/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { userServices } from "./user.service";
// import AppError from "../../errorHelpers/app.error";

const createUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
    // throw new Error("fake error");
    
    // throw new AppError(httpStatus.BAD_REQUEST,"fake error")
    const user= await userServices.createUserServices(req.body)
    res.status(httpStatus.CREATED).json({
        message:"User Created Successfully",
        user
    })
  } catch (err:any) {
    console.log(err) ;
 next(err)
  }
};

export const UserController = {
    createUser
}