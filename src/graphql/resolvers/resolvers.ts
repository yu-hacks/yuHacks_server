import User from "../../models/User";
export const resolvers = {
    Query: {
        user: async (_: any, { id }: { id: string }) => {
            return await User.findById(id);
        },
        users: async () => {
            return await User.find();
        },
    },
    Mutation: {
        addUser: async (_: any, args: any) => {
            const user = new User({
                ...args,
                role: 'PENDING',
                team: null
            });
            return await user.save();
        },
        updateUserRole: async (_: any, { id, role }: { id: string, role: string }) => {
            return await User.findByIdAndUpdate(id, { role }, { new: true }); // the option { new: true } ensures the updated document is returned
        },
    }
};
