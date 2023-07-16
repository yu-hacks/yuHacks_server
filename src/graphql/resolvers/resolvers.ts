import User, { IUser, UserRole } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../../controllers/verificationEmail';

const resolvers: IResolvers = {
  Query: {
    users: async () => {
      console.log("HELLO")
      return await User.find();
    },
    user: async (_, args: { _id: string }) => {
      return await User.findById(args._id);
    },
  },
  Mutation: {
    registerUser: async (
      _,
      args: {
        input: {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        };
      }
    ) => {
      args.input.password = await bcrypt.hash(args.input.password, 10);
      const newUser = new User({ ...args.input, role: UserRole.PENDING, emailVerified: false});
      await newUser.save();
      if (!sendVerificationEmail(args.input.firstName, args.input.email)) {
        console.log("Failed sending verification email to " + args.input.email + ". Trying again.");
        sendVerificationEmail(args.input.firstName, args.input.email) ? console.log("Succesfully sent") : console.log("Failed sending again"); 
      }
      return newUser;
    },

    applyHacker: async (_, { input }) => {
      const user = await User.findById(input._id);

      if (!user) {
        throw new Error("User not found");
      }

      Object.assign(user, input);
      user.role = UserRole.HACKER;
      await user.save();

      return user;
    },

    loginUser: async (_, args: { input: { email: string; password: string } }) => {
      const user = await User.findOne({ email: args.input.email });

      if (!user) {
        throw new Error("User not found");
      }

      const isEqual = await bcrypt.compare(
        args.input.password,
        user.password.toString()
      );

      if (!isEqual) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign({ _id: user.id, email: user.email }, "xxxx", {
        expiresIn: "1h",
      });

      return { _id: user.id, token: token, tokenExpiration: 1 };
    },
  },
};

export default resolvers;
