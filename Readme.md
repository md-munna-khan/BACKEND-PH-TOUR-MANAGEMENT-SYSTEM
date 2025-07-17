# Ph Tour Management Backend Part-4
GitHub Link:

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend/tree/part-4



Task: https://docs.google.com/document/d/13DI_gV9b9xz1-EM_Lh6lWkAq1jXBUpGimGIxya6HqJY/edit?usp=sharing

## 29-1 Configure Passport JS For Custom Authentication
- passport.ts
```ts
passport.use(
    new LocalStrategy({
        usernameField:"email",// he want add your email or name no problem
        passwordField:"password"
    },async (email:string,password:string,done)=>{
try {
     const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
   return done(null,false,{message:"User Does Not Exist"})
    // (parameter) done: (err?: Error | null | unknown, user?: Express.User | false, info?: object) => voi
  }
    const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  // my given password he matched in db.password who is already hashed same or different is same then he logged in
  if (!isPasswordMatched) {
    return done(null,false,{message:"Password Does Not Match"})
  }


return done(null,isUserExist)

} catch (error) {
    console.log(error);
    done(error)
}
    })
)
```
## 29-2 Check if the user has Google Authentication, during Credential Login
```ts
passport.use(
    new LocalStrategy({
        usernameField:"email",// he want add your email or name no problem
        passwordField:"password"
    },async (email:string,password:string,done)=>{
try {
     const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
   return done(null,false,{message:"User Does Not Exist"})
   // (parameter) done: (err?: Error | null | unknown, user?: Express.User | false, info?: object) => voi
  }

    const isGoogleAuthenticated=isUserExist.auths.some(providerObjects=>
      providerObjects.provider == "google"
    )
    if(isGoogleAuthenticated){
    return done(null,false,{message:"You have  Authenticated Through Google so if you Want to login with Credentials, then at first login with google and set a password for your Gmail and then you can login with email and password "})
    }
    const isPasswordMatched = await bcryptjs.compare(
    password as string,
   
    isUserExist.password as string
  );
 // my given password he matched in db.password who is already hashed same or different is same then he logged in
  if (!isPasswordMatched) {
    return done(null,false,{message:"Password Does Not Match"})
  }


return done(null,isUserExist)

} catch (error) {
    console.log(error);
    done(error)
}
    })
)
```
## 29-3 Implement Passport JS For Custom Authentication in routes and controllers
 - Now On login works will be like route -> controller -> passport (passport will authenticate and login) - works done 
 - Lets Understand The auth.route.ts routing more deeply 
- here passport is a middleware function. we are just using the function and express is calling the function ( like passport.authenticate()) of the middlewares like other middlewares we have created.

```ts 
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)
```
- here is another catch. why we have called the function for this route? we have done this because we have used `const redirect = req.query.redirect || "/"` here and passport do not know about it so we have trigger the function(req,res,next) manually so that express understand this. 

```ts 
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
```
- auth.route.ts 
```ts 

import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

//  /booking -> /login -> successful google login -> /booking frontend
// /login -> successful google login -> / frontend
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})
// this kept get because the authentication is done by google and we have nothing to send in body 

// api/v1/auth/google/callback?state=/booking this redirect state will be added in the url by the previous auth login route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)

// this is for setting the cookies 



export const authRoutes = router
```
- this concept is the key to understand. express just call the upper function and it do call function inside the function. so if we use passport.authenticate() in other function we need to manually trigger. 
- For login system response sending cookie setting works will be done inside passport controller that will be inside the auth.controller.ts -> credentialsLogin


#### Lets understand some kicks 
- where we are getting  (err: any, user: any, info: any) in the function? 
- remember ? we have used to send response inside the passport config done(err, user, info)? this the reason why we are getting here.
- auth.controller.ts 
- as passport is middleware for passing the error we need follow some rules like passport 
-  here we can not directly call the throw new AppError(403,err) because we are inside passport js service
-  `return next(err) ` ere we were not suppose to get return next(). still we are getting because we have manually triggered the function at the end (req, res, next). but we can not just write next(err)
-  we can not use not use done() here — because you're already in the final callback of passport.authenticate, where done() has already been called internally by Passport.
  
```ts 
       passport.authenticate("local", async (err: any, user: any, info: any) => {
        // where we are getting  (err: any, user: any, info: any) in the function? 
        // remember ? we have used to send response done(err, user, info)? this the reason why we are getting here. 
        if (err) {
            return new AppError(401, err)
            // here we can not directly call the throw new AppError(403,err) because we are inside passport js service 
            // things we can do here for throwing error 
            /*
            * return next(err) 

            here we were not suppose to get return next(). still we are getting because we have manually triggered the function at the end (req, res, next). but we can not just write next(err)

            * we can not use not use done() here — because you're already in the final callback of passport.authenticate, where done() has already been called internally by Passport.

            */
        }

        if (!user) {
            // console.log("from !user");
            // return new AppError(401, info.message)
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next) // express just call the upper function and it do call function inside the function. so if we use passport.authenticate() in other function we need to manually trigger. 
```

- we can use done in different ways 
- like we knew `done(err, user, info)` we can just use `done("user Not Found")` as well. this will set the error message to the error. 
## 29-4 Testing Credential Authentication with Passport
- For returning error we must use this previous did not worked 
- auth.controller.ts 
```ts 
        if (err) {
            // return next(err)

            // or 
            new AppError(401, err) 
        }
```
- final version of auth.controller.ts 

```ts 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"

import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes';
import { AuthServices } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import bcrypt from 'bcryptjs';
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userToken";
import { envVars } from "../../config/env";
import passport from "passport";


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    // res.cookie("accessToken", loginInfo.accessToken,
    //     {
    //         httpOnly: true,
    //         secure: false
    //     }
    // )
    // res.cookie("refreshToken", loginInfo.refreshToken,
    //     {
    //         httpOnly: true, // this is for setting the cookies in frontend 
    //         secure: false //because for security issue frontend normally do not allow to set cookies because backend and frontend have two different live server 
    //     }
    // )

    // both access token and refresh token works will be done by this function 
    // setAuthCookie(res, loginInfo)

    // // (method) Response<any, Record<string, any>, number>.cookie(name: string, val: string, options: CookieOptions): Response<any, Record<string, any>> (+2 overloads)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "User Logged In Successfully",
    //     data: loginInfo
    // })

    // all works including the response sending will be done by passport controller 


    // (method) Authenticator<Handler, any, any, AuthenticateOptions>.authenticate(strategy: string | string[] | passport.Strategy, callback?: passport.AuthenticateCallback | ((...args: any[]) => any) | undefined): any (+2 overloads)

    passport.authenticate("local", async (err: any, user: any, info: any) => {
        // where we are getting  (err: any, user: any, info: any) in the function? 
        // remember ? we have used to send response done(err, user, info)? this the reason why we are getting here. 
        if (err) {
            // return new AppError(401, err) we can not use this as well
            // here we can not directly call the throw new AppError(403,err) because we are inside passport js service 
            // things we can do here for throwing error 
            /*
            * return next(err) 

            here we were not suppose to get return next(). still we are getting because we have manually triggered the function at the end (req, res, next). but we can not just write next(err)

            * we can not use not use done() here — because you're already in the final callback of passport.authenticate, where done() has already been called internally by Passport.

            */

            // return next(err)
            // or

            return next(new AppError(401, err))
        }

        if (!user) {
            // console.log("from !user");
            // return new AppError(401, info.message)
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next) // express just call the upper function and it do call function inside the function. so if we use passport.authenticate() in other function we need to manually trigger. 
})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    // const refreshToken = req.headers.authorization as string // only used for test purpose 
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Access Token Received")
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)
    // this will set the newly generated access token (generated using refresh token) to the cookies

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Generated Successfully",
        data: tokenInfo
    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken",
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    )
    res.clearCookie("refreshToken",
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    )

    // (method) Response<any, Record<string, any>, number>.clearCookie(name: string, options?: CookieOptions): Response<any, Record<string, any>>

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null
    })

})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "password Changed Successfully",
        data: null
    })

})
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // wer are getting this because of  return done(null, user) // set by the passport.js 
    const user = req.user;

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1) // /booking => booking , => "/" => ""
    }

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "password Changed Successfully",
    //     data: null
    // })

    // after successful login it will redirect the home page to this link
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)

})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController,
}
```

- now we do not need auth.service.ts for login

```ts 
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from '../../errorHelpers/AppError';
import { IsActive, IUser } from "../user/user.interface"
import httpStatus from 'http-status-codes';
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from '../../config/env';
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";


// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload

//     const isUserExist = await User.findOne({ email })
//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Email Does Not Exist")
//     }

//     const isPasswordMatch = await bcrypt.compare(password as string, isUserExist.password as string)

//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.BAD_REQUEST, "Password Does Not Match")
//     }

//     // generating access token 

//     // const jwtPayload = {
//     //     userId: isUserExist._id,
//     //     email: isUserExist.email,
//     //     role: isUserExist.role
//     // }
//     // // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" })
//     // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

//     // // function sign(payload: string | Buffer | object, secretOrPrivateKey: jwt.Secret | jwt.PrivateKey, options?: jwt.SignOptions): string (+4 overloads)

//     // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

//     // we are not sending the password in response so deleted. 

//     const userTokens = createUserToken(isUserExist)

//     const { password: pass, ...rest } = isUserExist.toObject()
//     return {
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }
// }


const getNewAccessToken = async (refreshToken: string) => {
    // const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
    // // we do not have to check the verified status and throw error because if not verified it automatically send error . so no need to write if else 

    // const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
    // if (!isUserExist) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exist")
    // }

    // if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
    //     throw new AppError(httpStatus.BAD_REQUEST, `User Is ${isUserExist.isActive}`)
    // }
    // if (isUserExist.isDeleted) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User Is Deleted")
    // }
    // // generating access token 
    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // generating access token generating works will be done by this function 
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken: newAccessToken
    }
}


const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();

}
export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword
}
```
## 29-5 Handling Mongoose Cast Error and Duplicate Error

#### lets handle the duplicate error of mongoose first 
- we will get a code inside the error if any duplicate error happens it will give us a error code 11000 inside error using this we will handle the duplicate error 
- globalErrorHandler.ts 
```ts 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something went wrong !!"


    if (err.code === 11000) {
        // console.log(err)
        statusCode = 400;
        const matchedArray = err.message.match(/"([^"]*)"/)
        message = `${matchedArray[1]} already Exist`
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err?.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })

}
```
#### lets handle the castError error of mongoose
- if any not valid mongodb id is given for query it will show cast error. we will get `name = "castError"` in error. using this we wiill handle the cast error.   
- globalErrorHandler.ts 

```ts 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something went wrong !!"


    if (err.code === 11000) {
        // console.log(err)
        statusCode = 400;
        const matchedArray = err.message.match(/"([^"]*)"/)
        message = `${matchedArray[1]} already Exist`
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Mongodb Object Id ! Please Provide Valid Id ! "
    } 
    
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err?.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })

}
```
## 29-6 Handling Mongoose Validation Error
#### lets handle the mongoose validation error 
- observe the error pattern in console and make a optimized pattern 
- globalErrorHandler.ts 
```ts 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something went wrong !!"
    const errorSources: any = []


    if (err.code === 11000) {
        // console.log(err)
        statusCode = 400;
        const matchedArray = err.message.match(/"([^"]*)"/)
        message = `${matchedArray[1]} already Exist`
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid Mongodb Object Id ! Please Provide Valid Id ! "
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        const errors = Object.values(err.errors)
        // console.log(errors)

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        message = "Validation Error"
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err?.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })

}
```