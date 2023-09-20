import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
    userId: string,
    nickname: string,
    active: boolean,
    rooms: Array<string>
};

const UserSchema = new Schema(
    {
        userId: {type: String, require: true, unique: true, index: true},
        nickname: {type: String, require: true},
        active: {type: String, require: false},
        rooms: {type: Array, require: false}
    },
    {
        timestamps: true
    }
);

export default model<UserDocument>('User', UserSchema, 'User');
