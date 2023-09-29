import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/mysql';

export interface MessageDocument {
    messageId: number;
    message: string;
    date: Date;
    userId: number;
    nickname: string;
    type: string;
    roomId: number;
};

class ChatHistory extends Model {
    declare messageId: number;
    declare message: string;
    declare date: Date;
    declare userId: number;
    declare nickname: string;
    declare type: string;
    declare roomId: number;
}

ChatHistory.init({
    messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.STRING
    },
    date: {
        type: DataTypes.DATE
    },
    userId: {
        type: DataTypes.INTEGER
    },
    nickname: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    roomId: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize
});

ChatHistory.sync();

export default ChatHistory;
