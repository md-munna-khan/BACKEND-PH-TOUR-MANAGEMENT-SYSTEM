import bcryptjs from "bcryptjs";
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";


export const seedSuperAdmin= async ()=>{
try {
    const isSuperAdminExist =await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})

if(isSuperAdminExist){
    console.log("Super Admin Already Exist");
    return;
}
console.log("Trying to create Super Admin")
const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD,Number(envVars.BCRYPT_SALT_ROUND))

const authProvider:IAuthProvider={
    provider:"credentials",
    providerId:envVars.SUPER_ADMIN_EMAIL
}
const payload :IUser={
    name:"Super Admin",
    role:Role.SUPER_ADMIN,
    email:envVars.SUPER_ADMIN_EMAIL,
    password:hashedPassword,
    auths:[authProvider],
    isVerified:true
}
const superAdmin = await User.create(payload)
console.log("Super Admin Created Successfully\n")
console.log(superAdmin)

} catch (error) {
    console.log(error)
}
}