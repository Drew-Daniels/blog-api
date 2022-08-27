import { Schema, model, Model, Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    hash: string;
    isAuthor: boolean;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    hash: { type: String, required: true },
    isAuthor: { type: Boolean, required: true, default: false }
}, {
    timestamps: { createdAt: 'memberSince' }
});

const User: Model<IUser> = model('User', UserSchema);

export {
    IUser,
    User,
}
