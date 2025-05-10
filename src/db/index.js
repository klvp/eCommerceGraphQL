import { MongoClient } from 'mongodb';
import { env } from '../../env.js';
import config  from 'config';

const client = new MongoClient(env.MONGO_URL);
const dbName = config.get("DB_NAME");

async function connectToServer(dbName) {
    const mongoClient = await client.connect();
    const db = mongoClient.db(dbName);
    return db;
}

async function connectToDB(dbName) {
    try {
        const db = await connectToServer(dbName);
        console.log("DB Connected")

        return db;
    } catch (error) {
        console.error("DB Connection Error", {
            stack: error.stack,
            message: error.message,
        })

    }

}

const db = await connectToDB(dbName);

export { db }
