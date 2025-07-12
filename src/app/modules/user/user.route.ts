import {  Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "./user.interface";


const router = Router();


router.post("/register",validateRequest(createUserZodSchema),

  UserController.createUser
);

router.get("/all-users",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
