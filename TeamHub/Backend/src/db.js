import mongoose from "mongoose";

const connectDB = async () => {
    const connString = `${process.env.MONGO_URL}${process.env.DB_NAME}`;
    await mongoose.connect(connString);
    console.log("✅ MongoDB Connected");
};

export default connectDB;
