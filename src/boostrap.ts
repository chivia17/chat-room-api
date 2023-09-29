import app from './server';
import 'dotenv/config';
import sequelize from './helpers/mysql';

/**
 * Start the webservice handler
 * @returns {Promise} - A promise resolved when the server is up and running
 */
export async function startWS () {
    return new Promise(resolve => {
        const port = process.env.APP_PORT;

        app.listen(port, async () => {
            try {
                console.log("Server is running on port", port);
                await sequelize.authenticate();
                console.log('MySQL connection has been established successfully.');
                resolve(true)   
            } catch (error) {
                console.log("Error", error);
            }
        });
    });
}
