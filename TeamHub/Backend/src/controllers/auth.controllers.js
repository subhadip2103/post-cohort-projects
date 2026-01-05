import { z } from "zod"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import { signToken } from "../utils/jwt.js"


export const signupUsers = async (req, res) => {
    const requiredBody = z.object({
        firstname: z.string().min(2).max(50),
        lastname: z.string().min(2).max(50),
        email: z.email().min(8).max(50),
        password: z.string().min(8).max(30)
    })
    const ParsedDataWithSuccess = requiredBody.safeParse(req.body);
    if (!ParsedDataWithSuccess.success) {
        return res.status(400).json({
            Message: "Invalid Data sent",
            error: z.prettifyError(ParsedDataWithSuccess.error)

        })
    }

    const { firstname, lastname, email, password } = req.body;


    try {
        let hashedPassword = await bcrypt.hash(password, 12)
        await User.create({
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
        console.error(err.message);
        return res.status(409).json({
            message: "User already exists or database error"
        });
    }
}

export const signinUsers = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({
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

        let token = signToken({ userId: user._id })

        res.cookie('userAccessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 120 * 60 * 1000
        })
        res.status(200).json({ message: 'Logged in successfully' });

    } catch (error) {
        console.log(error)
        return res.sendStatus(403)
    }


}

export const verifyMe = async (req, res) => {
    const userId = req.userId;

    let user = await User.findOne({
        _id: userId
    }, { password: 0 });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        UserName: `${user.firstname} ${user.lastname}`,
        Email: user.email
    })

}
