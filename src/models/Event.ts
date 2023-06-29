import mongoose, { Document, Schema, Types } from 'mongoose';


export interface IEvent extends Document {
    eventId: String,
    eventName: String,
    startDate: Date,
    endDate: Date,
    description: String,
    sponsor: Types.ObjectId;
}

const EventSchema: Schema = new Schema({
    eventId: {type: String, required: true, unique: true},
    eventName: { type: String, required: true},
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    description: { type: String, required: true},
    sponsor: { type: Types.ObjectId, ref: 'User', required: true},
});

export default mongoose.model<IEvent>('Event', EventSchema);