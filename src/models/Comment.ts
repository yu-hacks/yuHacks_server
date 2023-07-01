import mongoose, { Document, Schema, Types } from 'mongoose';


export interface IComment extends Document {
    categoryId: String,
    name: String,
    description: String,
    posts: Types.ObjectId;
}

const CommentSchema: Schema = new Schema({
    categoryId: {type: String, required: true, unique: true},
    name: { type: String, required: true},
    description: { type: String, required: true},
    posts: { type: Types.ObjectId, ref: 'Post', required: true},
});

export default mongoose.model<IComment>('Comments', CommentSchema);