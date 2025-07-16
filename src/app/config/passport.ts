/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

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




// google Authentication
passport.use(
    new GoogleStrategy({
clientID:envVars.GOOGLE_CLIENT_ID,
clientSecret:envVars.GOOGLE_CLIENT_SECRET,
callbackURL:envVars.GOOGLE_CALLBACK_URL
    },async (accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback)=>{
        try {
            const email =profile.emails?.[0].value;
            if(!email){
                return done (null,false,{message:"NO Email Found"})
            }
            let user=await User.findOne({email})
            if(!user){
                user=await User.create({
                    email,
                    name:profile.displayName,
                    role:Role.USER,
                    isVerified:true,
                    auths:[
                        {
                            provider:"google",
                            providerId:profile.id
                        }
                    ]
                })
            }
            return done(null,user)
        } catch (error) {
            console.log("Google Strategy error",error)
            return done(error)
        }
    }
)
)


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) =>{
    done(null,user._id)
})

passport.deserializeUser(async(id:string,done:any)=>{
    try {
        const user=await User.findById(id)
        done (null,user)
    } catch (error) {
      console.log(error)  
      done(error)
    }
})