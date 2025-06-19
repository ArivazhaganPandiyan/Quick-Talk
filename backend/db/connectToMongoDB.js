import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        // Connection configuration
        const connectionOptions = {
            dbName: process.env.DB_NAME || "chat-app",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: "majority",
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
            socketTimeoutMS: 45000, // 45 seconds timeout for operations
        };

        // Connection event handlers
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB connection disconnected');
        });

        // Actual connection
        await mongoose.connect(process.env.MONGO_DB_URI, connectionOptions);
        
        console.log(`Connected to MongoDB database: ${mongoose.connection.db.databaseName}`);
        console.log(`MongoDB host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        
        // Graceful shutdown if in production
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        } else {
            // In development, throw error for better debugging
            throw error;
        }
    }
};

export default connectToMongoDB;