import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: Types.ObjectId | IUser;
  creationDate: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  creationDate: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
