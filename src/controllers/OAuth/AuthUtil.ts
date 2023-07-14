import User, { IUser } from "../../models/User";
import GenericMongoService from "../../mongo.services/genericMongoService";

const userMongoService = new GenericMongoService<IUser>(User);
export default async function saveUser(newUser: IUser): Promise<IUser> {
    const existingUser: IUser = await userMongoService.findOne({email: newUser.email})
    if(existingUser){
      return existingUser
    }
    return userMongoService.create(newUser).then(createdUser => {
      return createdUser
    })
  }