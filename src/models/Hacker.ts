import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IHacker extends Document {
    hackerId: String,
    firstName: String,
    lastName: String,
    email: String,
    school: String,
    year: String,
    website: String,
    github: String,
    linkedin: String,
    resume: String,
    allergies: String,
    dietaryNeeds: String,
    clothingSize: String,
    team: Types.ObjectId;
}

const HackerSchema: Schema = new Schema ({
    hackerId: { type: String, required: true, unique: true},
    firstName: { type: String, required: true},
    lastName: { type:String, required: true},
    email: { type: String, required: true},
    school: { type: String, required: true},
    year: { type: String, required: true},
    website: { type: String, required: false},
    github: { type: String, required: false},
    linkedin: { type: String, required: false},
    resume: { type: String, required: true},
    allergies: { type: String, required: false},
    dietaryNeeds: { type: String, required: false},
    clothingSize: { type: String, required: true},
    team: { type: Types.ObjectId, ref: 'Team'},
});

export default mongoose.model<IHacker>('Hacker',HackerSchema);