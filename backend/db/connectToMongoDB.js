import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            dbName: "chat-app", // Add your database name
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: "majority"
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error.message);
        process.exit(1); // Exit process on connection failure
    }
};

export default connectToMongoDB;