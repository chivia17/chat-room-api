import app from './server';
import 'dotenv/config'
import connect from './helpers/mongo';

/**
 * Start the webservice handler
 * @returns {Promise} - A promise resolved when the server is up and running
 */
export async function startWS () {
    return new Promise(resolve => {
        const port = process.env.APP_PORT;

        app.listen(port, () => {
            console.log("Server is running on port", port);
            connect();
            resolve(true)
        });
    });
}
