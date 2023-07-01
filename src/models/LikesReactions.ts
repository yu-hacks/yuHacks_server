import mongoose, { Document, Schema, Types } from 'mongoose';
import { Enum } from 'ts-mongoose/types/_shared';


export interface ILikeReaction extends Document {
    likeId: String,
    type: String,
    user: Types.ObjectId,
    posts: Types.ObjectId;
    comment: Types.ObjectId;
}

const LikeReaction: Schema = new Schema({
    likeId: {type: String, required: true, unique: true},
    type: { type: String, required: true},
    user: { type: Types.ObjectId, ref: 'User', required: true},
    posts: { type: Types.ObjectId, ref: 'Post'},
    comment: { type: Types.ObjectId, ref: 'Comment'},
});

export default mongoose.model<ILikeReaction>('LikesReactions', LikeReaction);