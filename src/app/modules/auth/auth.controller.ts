/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/app.error";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";


//=============================== credentials login with Passport js =======================================

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
passport.authenticate("local",async(err:any,user:any,info:any)=>{
if(err){
  // throw new AppError("some error"); // not working because we are all work in passport js
  
  // return new AppError( 401,"some error") // because when you call return you out of passport function
  return  next( new AppError (401,err))
}
if(!user){
   return  next( new AppError(401,info.message))
}
const userTokens=await createUserTokens(user)
  const { password: pass, ...rest } = user.toObject();
   setAuthCookie(res,userTokens)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User login Successfully",
      data:{
        accessToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user:rest
      }
    });
})(req,res,next)

    // res.cookie("accessToken",loginInfo.accessToken,{
    //     httpOnly:true,
    //     secure:false
    // })
  
    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //     httpOnly:true,
    //     secure:false
    // })
    //   setAuthCookie(res,loginInfo)
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "User login Successfully",
    //   data: loginInfo,
    // });
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
      message: "User logout Successfully",
      data: null
    });
  }
);


const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
 const oldPassword=req.body.oldPassword;
 const newPassword = req.body.newPassword;
 const decodedToken= req.user


  await AuthServices.resetpassword(oldPassword,newPassword,decodedToken as JwtPayload) 
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Change Successfully",
      data: null
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
let redirectTo = req.query.state?req.query.state as string:"" 
if(redirectTo.startsWith("/")){
  redirectTo=redirectTo.slice(1)
}
const user=req.user;
console.log("user",user)
if(!user){
  throw new AppError(httpStatus.NOT_FOUND,"User Not Found");
}
const tokenInfo=createUserTokens(user)
setAuthCookie(res,tokenInfo)
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password Change Successfully",
    //   data: null
    // });
   
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
