import { gql } from 'apollo-server-express';


export const typeDefs = gql`
    enum UserRole {
        PENDING
        HACKER
        SPONSOR
        ADMIN
    }

    type User {
        id: ID!
        userId: String!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        registrationDate: String!
        role: UserRole!
        team: ID
    }

    type Query {
        user(id: ID!): User
        users: [User]
    }

    type Mutation {
        addUser(userId: String!, firstName: String!, lastName: String!, email: String!, password: String!): User
        updateUserRole(id: ID!, role: UserRole!): User
    }
`;
