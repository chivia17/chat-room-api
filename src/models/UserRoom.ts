import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/mysql';

export interface UserRoomDocument {
    userId: number;
    roomId: number;
};

class UserRoom extends Model {
    declare userId: number;
    declare roomId: number;
};

UserRoom.init({
    userId: {
        type: DataTypes.INTEGER,
    },
    roomId: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize
});

UserRoom.sync();

export default UserRoom;
