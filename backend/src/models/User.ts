import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
}, {timestamps: true});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
