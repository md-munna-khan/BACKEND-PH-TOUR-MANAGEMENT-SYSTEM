/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync.";

import { sendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import { verifyToken } from "../../utils/jwt";
import { Jwt, JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserServices(req.body);
    //   res.status(httpStatus.CREATED).json({
    //     message:"User Created Successfully",
    //     user
    // })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload
    const verifiedToken=req.user;
    
    const payload= req.body;
    const user = await UserServices.
    updateUser(userId,payload,verifiedToken)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User updated Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    //   res.status(httpStatus.OK).json({
    //     message:"All users Retrieved Successfully",
    //     data:users
    // })
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser
};
