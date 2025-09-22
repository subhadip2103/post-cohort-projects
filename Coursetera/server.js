const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const { userRouter } = require("./routes/users")
const { courseRouter } = require("./routes/courses")
const { adminRouter } = require("./routes/admin")

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/courses", courseRouter);

async function main() {
    await mongoose.connect(`${process.env.MONGODB_URL}coursetera-db`);
    app.listen(3000, () => {
        console.log("running on port 3000")
    })
}

main()