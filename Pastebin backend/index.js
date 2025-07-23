const fs = require("fs");
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

function randomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
let requestcount = 0
app.use((req, res, next) => {
  requestcount++;
  next()

})
app.use((req, res, next) => {
  if (req.body.content && req.body.content.length > 5000) {
    res.status(400).send("CONTENT LENGTH EXCEEDED");
  } else {
    next();
  }
});

app.post('/paste', (req, res) => {
  let newbody = req.body.content;
  let pastecode = randomString(6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+');

  fs.readFile("pastebin.json", "utf-8", function (err, data) {
    if (err) {
      res.status(404).send("ERROR READING FILE");
    } else {
      let existingtask;
      if (data) {
        existingtask = JSON.parse(data);
      } else {
        existingtask = [];
      }

      existingtask.push({
        content: newbody,
        code: pastecode,
        timestamp: new Date().toLocaleString()
      });

      fs.writeFile("pastebin.json", JSON.stringify(existingtask, null, 2), "utf-8", function (err) {
        if (err) {
          res.status(404).send("UNABLE TO WRITE FILE");
        } else {
          res.status(200).json({
            msg: "your file has been updated successfully",
            code: pastecode,
            body: newbody
          });
        }
      });
    }
  });
});

app.get("/paste/:code", function (req, res) {
  let usercode = req.params.code;

  fs.readFile("pastebin.json", "utf-8", function (err, data) {
    if (err) {
      res.status(404).send("ERROR READING FILE");
    } else {
      let existingtask = JSON.parse(data);
      let found = false;
      for (let i = 0; i < existingtask.length; i++) {
        if (existingtask[i].code === usercode) {
          found = true;
          res.status(200).json({
            code: usercode,
            content: existingtask[i].content
          });
          break;
        }
      }
      if (found === false) {
        res.status(404).send("CODE NOT FOUND");
      }
    }
  });
});

app.get("/analytics", (req, res) => {
  res.json({ totalRequests: requestcount })
})
app.get("/all", (req, res) => {
  fs.readFile("pastebin.json", "utf-8", (err, data) => {
    if (err) {
      res.status(404).send('UNABLE TO READ FILE')
    }
    let existingbody = JSON.parse(data);
    res.status(200).json({
      Msg: "All bodies fetched succesfull",
      body: existingbody
    })
  })

})
app.listen(3000, function () {
  console.log("Server running on port 3000");
});
