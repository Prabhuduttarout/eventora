import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// => Resolution for bug in Node.js internal DNS .
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// dotenv.config();


// Connect to MongoDB using Mongoose
export const connectDBUsingMongoose = async () => {
    const url = process.env.DB_URL;
    const dbName = "evntora";
    try{
        await mongoose.connect(url, {
            dbName: dbName
        });
        console.log('Connected successfully to MongoDB server using Mongoose');
    }catch(err){
        console.error('Connection error:', err);
    }
}