import { promises } from "dns";
import mongoose from "mongoose";

const uri  = process.env.MONGO_URI

type connectionObj = {
    isConnected?: number
}

const connection: connectionObj = {}

async function dbConnection(): Promise<void> {
    if(connection.isConnected){
        console.log("Database is already connected ", connection.isConnected)
        return
    }
    try {
        const db  = await mongoose.connect( uri as string)

        connection.isConnected = db.connections[0].readyState

        console.log("Database is connected succefully", connection.isConnected)
    } catch (error) {
        console.log("DB connection failed", error )
        process.exit(1)
    }
}

export default dbConnection;