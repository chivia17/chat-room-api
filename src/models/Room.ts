import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/mysql';

export interface RoomDocument {
    id: number;
    roomId: string;
    name: string;
    description: string;
    totalUsers: number;
    userInRoom: number;
    private: boolean;
    active: boolean;
    owner: number;
};

class Room extends Model {
    declare id: number;
    declare roomId: string;
    declare name: string;
    declare description: string;
    declare totalUsers: number;
    declare userInRoom: number;
    declare private: boolean;
    declare active: boolean;
    declare owner: number;
};

Room.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roomId: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    totalUsers: {
        type: DataTypes.INTEGER
    },
    userInRoom: {
        type: DataTypes.INTEGER
    },
    private: {
        type: DataTypes.BOOLEAN
    },
    active: {
        type: DataTypes.BOOLEAN
    },
    owner: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize
});

Room.sync();

export default Room;
