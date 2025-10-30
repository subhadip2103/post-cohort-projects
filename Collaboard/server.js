const express = require("express");
const mongoose = require('mongoose');
const app = express();
require("dotenv").config()
const { UserRouter } = require("./Routes/users");
const { BoardRouter } = require("./Routes/boards");
const { cardRouter } = require("./Routes/cards")
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/users", UserRouter)
app.use("/api/v1/boards", BoardRouter)
app.use("/api/v1/cards", cardRouter)

try {
    async function main() {
        await mongoose.connect(`${process.env.MONGODB_URL}collaboard-db`);
        app.listen(3000, () => {
            console.log("Running on port 3000")
        });
    }

    main();
}
catch (err) {
    console.log(err)
    console.log("cannot connect server or database")
}