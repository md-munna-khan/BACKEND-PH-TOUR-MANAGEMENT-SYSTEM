/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { UserServices,  } from "./user.service";
import { catchAsync } from "../../utils/catchAsync.";
import { success } from "zod/v4";



const createUser = catchAsync(async(req: Request, res: Response,next:NextFunction)=>{
  const user=await UserServices.createUserServices(req.body)
      res.status(httpStatus.CREATED).json({
        message:"User Created Successfully",
        user
    })
})
// const createUser = async (req: Request, res: Response,next:NextFunction) => {
//   try {
//     // throw new Error("fake error");
    
//     // throw new AppError(httpStatus.BAD_REQUEST,"fake error")
//     const user= await UserServices.createUserServices(req.body)
//     res.status(httpStatus.CREATED).json({
//         message:"User Created Successfully",
//         user
//     })
//   } catch (err:any) {
//     console.log(err) ;
//  next(err)
//   }
// };

const getAllUsers= catchAsync(async(req: Request, res: Response,next:NextFunction)=>{
  const users=await UserServices.getAllUsers()
      res.status(httpStatus.OK).json({
        message:"All users Retrieved Successfully",
        data:users
    })
})

export const UserController = {
    createUser,
    getAllUsers
}