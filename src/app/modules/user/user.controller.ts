/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { userServices } from "./user.service";
const createUser = async (req: Request, res: Response,next:NextFunction) => {
  try {
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