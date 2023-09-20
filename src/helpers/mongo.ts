import mongoose, { ConnectOptions } from 'mongoose';

/**
 * Connection to mongo
 * @returns {Promise} - A promise resolved when the server is connected to mongo
 */
 function connect() {
    const dbURI = process.env.APP_DB_CONNECTION_URI || '';
    
    return mongoose
        .connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => {
            console.log('Mongo connected')
        })
        .catch((error) => {
            console.error("DB error", error);
            process.exit(1);
        });
}

export default connect;