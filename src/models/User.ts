import { Model, DataTypes } from 'sequelize';
import sequelize from '../helpers/mysql';


export interface UserDocument {
    id: string;
    nickname: string;
    active: boolean;
    password: string;
};

class User extends Model {
    declare id: number;
    declare nickname: string;
    declare active: boolean;
    declare password: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    sequelize
});

User.sync();

export default User;
