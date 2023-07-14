import { userMongoService } from "../..";
import { IUser } from "../../models/User";


export default async function saveUser(newUser: IUser): Promise<IUser> {
    const existingUser: IUser = await userMongoService.findOne({email: newUser.email})
    if(existingUser){
      return existingUser
    }
    return userMongoService.create(newUser).then(createdUser => {
      return createdUser
    })
  }