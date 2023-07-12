import User, { IUser, UserRole } from '../../models/User'
import { IResolvers } from '@graphql-tools/utils'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const resolvers: IResolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    user: async (_, { userId }) => {
      return await User.findById(userId);
    },
    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });

      if (!user) {
        throw new Error('User not found');
      }

      const isEqual = await bcrypt.compare(input.password, user.password);

      if (!isEqual) {
        throw new Error('Password is incorrect');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'xxxx',  
        { expiresIn: '1h' },
      );

      return { userId: user.id, token: token, tokenExpiration: 1 };
    },
  },
  Mutation: {
    registerUser: async (_, { input }) => {
      input.password = await bcrypt.hash(input.password, 10);
      const newUser = new User({ ...input, role: UserRole.PENDING });
      await newUser.save();
      return newUser;
    },
    applyHacker: async (_, { input }) => {
      const user = await User.findById(input.userId);

      if (!user) {
        throw new Error('User not found');
      }

      Object.assign(user, input);
      user.role = UserRole.HACKER;
      await user.save();

      return user;
    },
  },
};

export default resolvers;
