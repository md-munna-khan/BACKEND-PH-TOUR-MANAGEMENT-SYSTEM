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