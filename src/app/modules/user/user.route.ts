import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import { validateRequest } from "../../middleware/validateRequest";
import AppError from "../../errorHelpers/app.error";
import   { JwtPayload }   from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../../config/env";

const router = Router();
const checkAuth =(...authRole:string[])=>async (req: Request, res: Response,next:NextFunction)=>{

  try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
      throw new AppError(403,"No token Received");
      
    }
    const verifiedToken =verifyToken(accessToken,envVars.JWT_ACCESS_SECRET)
    if(!verifiedToken){
      throw new AppError(403,"You are not Authorized");
      
    }
    if((verifiedToken as JwtPayload).role !==Role.ADMIN ){
        throw new AppError(403,"You are not permitted to view this route");
    }
    console.log(verifiedToken)
    next()
  } catch (error) {
    next(error)
  }
}

router.post("/register",validateRequest(createUserZodSchema),

  UserController.createUser
);

router.get("/all-users",checkAuth("ADMIN","SUPER_ADMIN"), UserController.getAllUsers);

export const UserRoutes = router;
