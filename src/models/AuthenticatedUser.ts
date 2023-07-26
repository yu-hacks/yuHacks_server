import { UserRole } from "./User";

export interface IAuthenticatedUser {
    email: string,
    id: string,
    role: UserRole
}

export interface IAccessToken{
    token: string
}