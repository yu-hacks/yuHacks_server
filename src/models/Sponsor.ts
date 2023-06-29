import mongoose, { Document, Schema } from 'mongoose';

export interface ISponsor extends Document {
    sponsorId: String,
    firstName: String,
    lastName: String,
    email: String,
    website: String,
}

const SponsorSchema: Schema = new Schema ({
    sponsorId: { type: String, required: true, unique: true},
    firstName: { type: String, required: true,},
    lastName: { type: String, required: true},
    email: { type: String, required:true},
    website: { type: String, required: true,}
});

export default mongoose.model<ISponsor>('Sponsor', SponsorSchema);