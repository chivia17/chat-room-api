import { Schema, model, Document } from 'mongoose';

export interface MessageDocument {
    messageId: Schema.Types.ObjectId,
    message: string,
    date: Date,
    userId: string,
    nickname: string,
    type: string
};

const MessageSchema = new Schema(
    {
        data: {type: String, require: true },
        date: {type: Date, require: true },
        userId: {type: String, require: true },
        nickname: {type: String, require: true},
        type: {type: String, require: true}
    },
    {
        timestamps: true
    }
)

export interface ChatHistoryDocument extends Document {
    roomId: string,
    messages: Array<MessageDocument>
};

const ChatHistorySchema = new Schema(
    {
        roomId: {type: String, require: true, unique: true, index: true},
        messages: [MessageSchema]

    },
    {
        timestamps: true
    }
);

export default model<ChatHistoryDocument>('ChatHistory', ChatHistorySchema, 'ChatHistory');
