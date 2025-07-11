import AppError from "../../errorHelpers/app.error";
import { IUser } from "../user/user.interface"
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
const credentialsLogin = async (payload:Partial<IUser>)=>{
const {email,password}=payload
 const isUserExist = await User.findOne({email});
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist");
  }
  const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)
  if(!isPasswordMatched){
     throw new AppError(httpStatus.BAD_REQUEST, "incorrect password");
    
  }
// const {password,...rest}=isUserExist;

  return{
 email:isUserExist.email
  }
}
export const AuthServices={
    credentialsLogin
}