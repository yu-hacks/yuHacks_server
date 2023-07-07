import mongoose, { Document, Schema, Types } from 'mongoose';


export interface ICategory extends Document {
    categoryId: String,
    name: String,
    description: String,
    posts: string[];
}

const EventSchema: Schema = new Schema({
    categoryId: {type: String, required: true, unique: true},
    name: { type: String, required: true},
    description: { type: String, required: true},
    posts: { type: [String], required: true},
});

export default mongoose.model<ICategory>('Event', CategorySchema);