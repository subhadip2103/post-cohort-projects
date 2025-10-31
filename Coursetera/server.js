const express = require('express');
require("dotenv").config()
const mongoose = require("mongoose");
const app = express();
const jwt = require('jsonwebtoken')
const { UserRouter } = require("./Routes/users");
const { CourseRouter } = require("./Routes/courses");
const { adminRouter } = require("./Routes/admin");
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json())

app.use("/api/v1/users", UserRouter)
app.use("/api/v1/courses", CourseRouter)
app.use("/api/v1/admins", adminRouter)

try {
    async function main() {
        await mongoose.connect(`${process.env.MONGODB_URL}${process.env.DB_NAME}`);
        app.listen(3000, () => {
            console.log(`Running on port ${PORT}`)
        });
    }

    main();
}
catch(err){
    console.log("Unable to connect server or database");
    console.log(err)
}