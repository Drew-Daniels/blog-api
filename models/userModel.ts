import { Schema, Model } from 'mongoose';

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    hash: String,
});

export default new Model('User', userSchema);
