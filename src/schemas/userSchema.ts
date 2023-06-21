import { buildSchema } from 'graphql';

const userSchema = buildSchema(`
    type User {
        id: Int!
        name: String!
        email: String!
        hashedPassword: String!
        role: String!
        resume: String
        companyName: String
    }

    input CreateUserInput {
        id: Int!
        name: String!
        email: String!
        hashedPassword: String!
        role: String!
        resume: String
        companyName: String
    }

    input UpdateUserInput {
        id: Int!
        name: String
        email: String
        hashedPassword: String
        role: String
        resume: String
        companyName: String
    }

    input GetUserInput {
        id: Int!
    }

    input LoginInput {
        email: String!
        hashedPassword: String!
    }

    type Query {
        getUser(input: GetUserInput): User
        getUsers: [User]
    }

    type Mutation {
        registration(input: CreateUserInput): User!
        login(input: LoginInput): User
        updateInfo(input: UpdateUserInput): User!
        deleteUser(input: GetUserInput): User!
    }

`)

export default userSchema;