import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import { userServices } from "./user.service";
const createUser = async (req: Request, res: Response) => {
  try {
    const user= await userServices.createUserServices(req.body)
    res.status(httpStatus.CREATED).json({
        message:"User Created Successfully",
        user
    })
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `something went wrong ${error.message}`,
    });
  }
};

export const UserController = {
    createUser
}