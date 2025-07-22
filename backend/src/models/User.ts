import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?: string;
}

const UserSchema: Schema = new Schema<IUser>({
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    refreshToken: {type: String},
}, {timestamps: true});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
