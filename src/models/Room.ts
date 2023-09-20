import { Schema, model, Document } from 'mongoose';

export interface RoomDocument extends Document {
    roomId: string,
    name: string,
    description: string,
    totalUsers: number,
    userInRoom: number,
    private: boolean,
    active: boolean,
    owner: string,
    users: Array<string>
};

const RoomSchema = new Schema(
    {
        roomId: {type: String, require: true, unique: true, index: true},
        name: {type: String, require: true},
        description: {type: String, require: true},
        totalUsers: {type: Number, default: 12, require: true},
        userInRoom: {type: Number, default: 0, require: true},
        private: {type: Boolean, require: true},
        active: {type: Boolean, require: false},
        owner: {type: String, require: true},
        users: {type: Array}
    },
    {
        timestamps: true
    }
);

export default model<RoomDocument>('Room', RoomSchema, 'Room');
