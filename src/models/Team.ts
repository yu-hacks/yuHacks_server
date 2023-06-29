import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
    name: String,
    minSize: number;
    maxSize: number;
}

const TeamSchema: Schema = new Schema ({
    name: { type: String, required: true},
    minSize: { type: Number, required: true},
    maxSize: { type: Number, required: true},
});

export default mongoose.model<ITeam>('Team', TeamSchema);