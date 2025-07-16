import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/app.error";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface";

 export const checkAuth =(...authRoles:string[])=>async (req: Request, res: Response,next:NextFunction)=>{

  try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
      throw new AppError(403,"No token Received");
      
    }
    const verifiedToken =verifyToken(accessToken,envVars.JWT_ACCESS_SECRET) as JwtPayload
   
    // if(!verifiedToken){
    //   throw new AppError(403,"You are not Authorized");
    //   }
 const isUserExist = await User.findOne({ email:verifiedToken.email});
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist");
  }
  if (isUserExist.isActive === IsActive.BLOCKED ||isUserExist.isActive === IsActive.INACTIVE ) {
    throw new AppError(httpStatus.BAD_REQUEST,`user is ${isUserExist.isActive}` );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

    if((!authRoles.includes(verifiedToken.role))){
        throw new AppError(403,"You are not permitted to view this route");
    }
   req.user = verifiedToken;
 
    next()
  } catch (error) {
    next(error)
  }
}