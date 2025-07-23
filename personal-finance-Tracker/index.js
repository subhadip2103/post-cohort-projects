const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const express = require('express');
const app = express();


const { default: ShortUniqueId } = require('short-unique-id');
const uid = new ShortUniqueId({ length: 10 });


// const JWT_SECRET = process.env.JWT_SECRET;


function decodeToken(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("No token provided");
    }

    try {
        let userinfo = jwt.verify(token, process.env.JWT_SECRET);
        if (userinfo) {
            let { username, userid } = userinfo;
            req.username = username;
            req.userid = userid;
            return next();
        }
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

    res.status(401).send("Invalid token");
}


app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html")
})
app.post("/signup", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    fs.readFile("user.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(401).send("Error reading file")
        }
        let currentusers = JSON.parse(data);
        if (currentusers.find(user => user.username === username)) {
            return res.status(404).json({ Msg: "User already exists" })
        }

        currentusers.push({
            username: username,
            password: password,
            userid: crypto.randomUUID()
        })
        fs.writeFile("user.json", JSON.stringify(currentusers, null, 2), "utf-8", (err) => {
            if (err) {
                res.status(404).send('Error writing file')
            }
            else {
                res.status(200).json({ Msg: 'You have signed up successfully' })
            }
        })


    })
})

app.post("/signin", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    fs.readFile('user.json', "utf-8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading file.")
        }
        let currentusers = JSON.parse(data);
        let user = currentusers.find(user => user.username === username && user.password === password);

        if (user) {
            try {
                const token = jwt.sign({ username: username, userid: user.userid }, process.env.JWT_SECRET);
                return res.status(200).json({ token });
            } catch (err) {
                console.error("JWT Sign Error:", err);
                return res.status(500).send("Token creation failed.");
            }


        }
        else {
            return res.status(404).send('Invalid credentials')
        }
    })
})

app.get("/me", (req, res) => {
    let token = req.headers.authorization;

    if (token) {
        let decodeinfo = jwt.verify(token, process.env.JWT_SECRET);
        if (decodeinfo) {
            let { username, userid } = decodeinfo;
            res.status(200).json({
                username: username,
                userid: userid
            })
        }
        else {
            res.status(404).send('Invalid token')
        }


    }
    else {
        res.status(400).send('Please provide the token')
    }
})

app.post("/transactions", decodeToken, (req, res) => {
    let username = req.username;
    let userid = req.userid;
    let date = new Date;
    let transaction = req.body.transaction;
    transaction.userid = userid;
    transaction.username = username;
    transaction.date = date.toLocaleDateString();
    const txnId = uid.rnd();
    transaction.id = txnId

    fs.readFile("transactions.json", "utf-8", (err, data) => {
        if (err) {
            res.status(404).send('Error reading file.')
        }
        let exisitingtransactions = JSON.parse(data);
        exisitingtransactions.push(transaction);

        fs.writeFile("transactions.json", JSON.stringify(exisitingtransactions, null, 2), "utf-8", (err) => {
            if (err) {
                res.status(404).send("Error writing file")
            }
            else {
                res.status(200).json({
                    Msg: "Transaction added successfully",
                    transactionId: transaction.id
                })

            }
        })
    })

})

app.get("/transactions", decodeToken, (req, res) => {
    let username = req.username;
    let userid = req.userid;

    fs.readFile("transactions.json", "utf-8", (err, data) => {
        if (err) {
            res.status(404).send("Error reading file.")
        }
        let exisitingtransactions = JSON.parse(data);
        let usertransactions = exisitingtransactions.filter(transaction => transaction.username === username && transaction.userid === userid);

        res.status(200).json({
            Transaction: usertransactions
        })

    })
})

app.delete("/transactions/:id",decodeToken, (req, res) => {
    let transactionId = req.params.id;

    fs.readFile("transactions.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading file.")
        }
        let exisitingtransactions = JSON.parse(data);
        let txnindex = exisitingtransactions.findIndex(transaction => transaction.id === transactionId);
        if (txnindex === -1) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        else {
            exisitingtransactions.splice(txnindex, 1);
        }

        fs.writeFile("transactions.json",JSON.stringify(exisitingtransactions, null, 2), "utf-8", (err) => {
            if (err) {
                return res.status(404).send("Error writing file")
            }
            else {
                res.status(200).json({
                    msg: 'Transaction deleted successfully'
                })
            }
        })
    })
})

app.patch("/transactions/:id",decodeToken, (req, res) => {
    let transactionId = req.params.id
    let updatedtxn = req.body.transaction;

    fs.readFile("transactions.json", "utf-8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading file.")
        }
        let exisitingtransactions = JSON.parse(data);
        let transaction = exisitingtransactions.find(transaction => transaction.id === transactionId)
        if (transaction !== undefined) {
            const allowedFields = ['title', 'amount', 'type', 'category'];
            Object.keys(req.body).forEach(key => {
                if (allowedFields.includes(key)) {
                    transaction[key] = req.body[key];
                }
                else {
                    return res.status(401).send("Invalid key to update transaction")
                }
            });
        }
        else {
            return res.status(404).send("Invalid transaction id")
        }

        fs.writeFile("transactions.json", JSON.stringify(exisitingtransactions, null, 2), "utf-8", (err) => {
            if (err) {
                return res.status(404).send("Error writing file")
            }
            else {
                res.status(200).json({
                    Msg: 'Transaction updated successfully',
                    Updatedtransaction: transaction
                })
            }
        })
    })
})

app.listen(3000, () => {
    console.log('Running on port 3000')
})