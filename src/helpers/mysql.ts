import { Sequelize } from 'sequelize';


const sequelize = new Sequelize(
    process.env.MYSQL_DB_NAME as string,
    process.env.MYSQL_INIT_USER as string,
    process.env.MYSQL_INIT_PASSWORD as string,
    {
        host: 'mysql',
        port: 3306,
        dialect: 'mysql'
    });


export default sequelize;
    