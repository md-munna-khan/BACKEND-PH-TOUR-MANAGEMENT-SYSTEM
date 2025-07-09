import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    })
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