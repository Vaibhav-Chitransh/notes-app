import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.MONGO_URI);
        console.log(`Connection to database successful!!`);
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
    }
}

export default connectDB;