/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/app.error";
import { setAuthCookie } from "../../utils/setCookie";
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    // res.cookie("accessToken",loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
  
    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false
    // })
      setAuthCookie(res,loginInfo)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login Successfully",
      data: loginInfo,
    });
  }
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST,"NO Refresh token received from cookies")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    // res.cookie("accessToken",
    //     tokenInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
      setAuthCookie(res,tokenInfo)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Retrieved Successfully",
      data: tokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   res.clearCookie("accessToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
   res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   })
   
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login Successfully",
      data: null
    });
  }
);


const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
 const oldPassword=req.body.oldPassword;
 const newPassword = req.body.newPassword;
 const decodedToken= req.user

  await AuthServices.resetpassword(oldPassword,newPassword,decodedToken)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Change Successfully",
      data: null
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword
};
