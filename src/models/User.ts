import mongoose, { Document, Schema, Types } from 'mongoose';


export enum UserRole {
    HACKER = "hacker",
    SPONSOR = "sponsor",
    ADMIN = "admin",
    PENDING = 'pending',
}

export interface IUser {
    userId: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    registrationDate: Date,
    role: UserRole,
    emailVerified: Boolean,
    passwordResetToken: String,
    team: Types.ObjectId;
}

const UserSchema: Schema<IUser> = new Schema ({
    userId: { type: String, requiresd: true, unique: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type:String, required: false,},
    registrationDate: { type: Date, required: true, default: Date.now},
    role: { type:String, required: true, enum: UserRole},
    team: { type: Types.ObjectId, ref: 'Team'},
});

export default mongoose.model<IUser>('User', UserSchema);