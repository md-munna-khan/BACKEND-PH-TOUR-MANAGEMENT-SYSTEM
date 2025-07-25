/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/app.error";
import { IAuthProvider, IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not Exist");
//   }

//   const isPasswordMatched = await bcryptjs.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "incorrect password");
//   }


//   const userTokens = createUserTokens(isUserExist);

//   // delete isUserExist.password;
//   const { password: pass, ...rest } = isUserExist.toObject();
//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  // const userTokens = createUserTokens(isUserExist)
  //   // delete isUserExist.password;
  //   const {password : pass,...rest}=isUserExist.toObject()
  return {
    accessToken: newAccessToken,
  };
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);
 
  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );
  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "old password does not match");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();
};
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  // const user = await User.findById(decodedToken.userId);
 
  // const isOldPasswordMatch = await bcryptjs.compare(
  //   oldPassword,
  //   user!.password as string
  // );
  // if (!isOldPasswordMatch) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, "old password does not match");
  // }
  // user!.password = await bcryptjs.hash(
  //   newPassword,
  //   Number(envVars.BCRYPT_SALT_ROUND)
  // );
  // user!.save();
};
const setPassword = async (
 userId:string,
 plainPassword:string
) => {

  const user= await User.findById(userId)
  if(!user){
    throw new AppError (404,"User Not Found")
  }
  if(user.password && user.auths.some(providerObject => providerObject.provider === "google")){
      throw new AppError (httpStatus.BAD_REQUEST,"You have already set Your Password Now You can change your password from profile password update")
  }

  const hashedPassword = await bcryptjs.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  )
const credentialProvider:IAuthProvider={
  provider:'credentials',
  providerId:user.email
}
const auths:IAuthProvider[] =[...user.auths,credentialProvider]
user.password = hashedPassword
user.auths = auths
await user.save()

};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword
};
