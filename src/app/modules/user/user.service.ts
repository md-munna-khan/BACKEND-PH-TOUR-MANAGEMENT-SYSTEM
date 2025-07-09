import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserServices = async (payload:Partial<IUser>)=>{
const { name, email } = (payload)
    const user = await User.create({
      name,
      email,
    })
    return user
}

 export const userServices ={
    createUserServices
}