const express = require("express");
const JWT_SECRET = process.env.JWT_SECRET;  
const bcrypt = require("bcrypt")
const UserRouter = express.Router();
const { z, email, string } = require("zod");
const { UserModel, BoardModel } = require("../db");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../Middlewares/usermiddleware");



UserRouter.post("/signup", async (req, res) => {
  const requiredbody = z.object({
    email: z.email().max(50),
    password: z.string().min(8).max(30),
    firstname: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
  })

  const parsedDataWithSuccess = requiredbody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    return res.status(404).json({
      message: "incorrect format",
      error: z.prettifyError(parsedDataWithSuccess.error)
    })
  }

  const { firstname, lastname, email, password } = req.body

  let errorthrown = false;

  try {
    let hashedPassword = await bcrypt.hash(password, 8)
    await UserModel.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword

    })

    return res.status(201).json({
      message: "User signed up successfully."
    });
  }
  catch (err) {
    console.error(err);
    return res.status(409).json({
      message: "User already exists or database error.",
      error: err.message
    });
  }

})

UserRouter.post("/signin", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let user = await UserModel.findOne({
      email: email
    })
    if (!user) {
      return res.status(401).json({
        Message: "User doesn't exist"
      })
    }

    const passwordmatch = await bcrypt.compare(password, user.password)

    if (!passwordmatch) {
      return res.status(403).json({
        Message: "Invalid credentials"
      })
    }

    let token = jwt.sign({
      userId: user._id
    }, JWT_SECRET)

    res.cookie('userAccessToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 120 * 60 * 1000
    })
    res.status(200).json({ message: 'Logged in successfully' });
  }
  catch (err) {
    console.log(err)
    return res.sendStatus(403)
  }
})

UserRouter.get("/me", userMiddleware, async(req, res) => {
  const userId = req.userId;

  let user =await UserModel.findOne({
    _id: userId
  },{ password: 0 });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    UserName: `${user.firstname} ${user.lastname}`,
    Email: user.email
  })

})

UserRouter.get("/boards", userMiddleware, async (req, res) => {
  const userId = req.userId;
  let Boards;

  try {
    Boards = await BoardModel.find({
      $or: [
        { creatorId: userId },
        { members: { $in: [userId] } }
      ]
    }).select("boardId title description createdAt");
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Message: "Cannot find boards"
    });
  }

  res.status(200).json({
    Message: "Boards found successfully",
    Boards
  });
});

module.exports={UserRouter}