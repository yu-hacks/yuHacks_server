import mongoose, { Document, Schema, Types, ObjectId } from 'mongoose';


export enum UserRole {
    HACKER = "HACKER",
    SPONSOR = "SPONSOR",
    ADMIN = "ADMIN",
    PENDING = 'PENDING',
}

export interface IUser {
    _id?: ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: string,
    registrationDate: Date,
    role: UserRole,
    emailVerified: Boolean,
    passwordResetToken?: String,
    team?: Types.ObjectId | undefined;

    school?: String,
    year?: String,
    website?: String,
    github?: String,
    linkedin?:String,
    resume?:String,
    allergies?:String,
    dietaryNeeds?:String,
    clothingSize?:String,
}

const UserSchema: Schema<IUser> = new Schema ({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type:String, required: false,},
    registrationDate: { type: Date, required: true, default: Date.now},
    role: { type:String, required: true, enum: UserRole},
    emailVerified: { type:Boolean, required: true, default: false},
    team: { type: Types.ObjectId, ref: 'Team'},

    school: {type: String, required: false},
    year: {type: String, required: false},
    website: {type: String, required: false},
    github: {type: String, required: false},
    linkedin: {type: String, required: false},
    resume: {type: String, required: false},
    allergies: {type: String, required: false},
    dietaryNeeds: {type: String, required: false},
    clothingSize: {type: String, required: false},
    

});

export default mongoose.model<IUser>('User', UserSchema);