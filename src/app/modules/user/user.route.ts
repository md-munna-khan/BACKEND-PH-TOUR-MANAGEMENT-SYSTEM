import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import { validateRequest } from "../../middleware/validateRequest";
import AppError from "../../errorHelpers/app.error";
import  Jwt, { JwtPayload }   from "jsonwebtoken";
import { Role } from "./user.interface";

const router = Router();

router.post("/register",validateRequest(createUserZodSchema),

  UserController.createUser
);

router.get("/all-users",async (req: Request, res: Response,next:NextFunction)=>{

  try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
      throw new AppError(403,"No token Received");
      
    }
    const verifiedToken = Jwt.verify(accessToken,"secret")
    if(!verifiedToken){
      throw new AppError(403,"You are not Authorized");
      
    }
    if((verifiedToken as JwtPayload).role !==Role.ADMIN || Role.SUPER_ADMIN){
        throw new AppError(403,"You are not permitted to view this route");
    }
    console.log(verifiedToken)
    next()
  } catch (error) {
    next(error)
  }
}, UserController.getAllUsers);

export const UserRoutes = router;
