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