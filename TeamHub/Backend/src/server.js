import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Fatal Startup Error:", err.message);
        process.exit(1);
    }
};

startServer();
