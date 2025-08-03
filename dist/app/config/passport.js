"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email", // he want add your email or name no problem
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        // method-1
        if (!isUserExist) {
            return done(null, false, { message: "User Does Not Exist" });
            // (parameter) done: (err?: Error | null | unknown, user?: Express.User | false, info?: object) => voi
        }
        // method-1
        // if(!isUserExist){
        //     return done("user Does Not Exist")
        // }
        if (!isUserExist.isVerified) {
            //   throw new AppError(httpStatus.BAD_REQUEST, "User is Not Verified");
            return done("User is Not Verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            // throw new AppError(httpStatus.BAD_REQUEST,`user is ${isUserExist.isActive}` );
            return done(`user is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
            return done("User is Deleted");
        }
        const isGoogleAuthenticated = isUserExist.auths.some(providerObjects => providerObjects.provider == "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done(null, false, { message: "You have  Authenticated Through Google so if you Want to login with Credentials, then at first login with google and set a password for your Gmail and then you can login with email and password " });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        // my given password he matched in db.password who is already hashed same or different is same then he logged in
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password Does Not Match" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
})));
// google Authentication
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { message: "NO Email Found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
            //   throw new AppError(httpStatus.BAD_REQUEST, "User is Not Verified");
            // done( "User is Not Verified")
            return done(null, false, { message: "user is not verified" });
        }
        if (isUserExist && (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE)) {
            // throw new AppError(httpStatus.BAD_REQUEST,`user is ${isUserExist.isActive}` );
            return done(`user is ${isUserExist.isActive}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted");
            return done(null, false, { message: "user is deleted" });
        }
        if (!isUserExist) {
            isUserExist = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id
                    }
                ]
            });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google Strategy error", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
