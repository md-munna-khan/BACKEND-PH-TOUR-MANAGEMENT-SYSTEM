import AppError from "../../errorHelpers/app.error";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
const createUserServices = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;
  const IUserExist = await User.findOne({email});
  if (IUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
const authProvider:IAuthProvider={provider:"credentials",providerId:email as string}
  const user = await User.create({
    email,
    auths:[authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserServices = {
  createUserServices,
  getAllUsers,
};
