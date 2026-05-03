import dotenv from 'dotenv'
dotenv.config();

if(!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined in environment variables");
if(!process.env.PORT) throw new Error("PORT is not defined in environment variables");
if(!process.env.ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
if(!process.env.REFRESH_TOKEN_SECRET) throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
if(!process.env.NODE_ENV) throw new Error("NODE_ENV is not defined in environment variables");

const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    NODE_ENV: process.env.NODE_ENV
}

export default config;