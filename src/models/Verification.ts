import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
    email: String,
    verificationToken: String,
    date: Date
}

const VerificationSchema: Schema = new Schema ({
    email: { type: String, required: true},
    verificationToken: { type: String, required: true},
    date: { type: Date, required: true},
});

export default mongoose.model<IVerification>('Verification', VerificationSchema);