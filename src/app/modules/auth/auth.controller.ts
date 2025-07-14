/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync."
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
const credentialsLogin =catchAsync(async(req: Request, res: Response,next:NextFunction)=>{

    const loginInfo = await AuthServices.credentialsLogin(req.body)
    sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
       message:"User login Successfully",
       data:loginInfo
    })
})
const getNewAccessToken =catchAsync(async(req: Request, res: Response,next:NextFunction)=>{
const refreshToken=req.headers.authorization as string;
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)
    sendResponse(res,{
      success:true,
      statusCode:httpStatus.OK,
       message:"User login Successfully",
       data: tokenInfo
    })
})




export const AuthControllers={
    credentialsLogin,
    getNewAccessToken
}