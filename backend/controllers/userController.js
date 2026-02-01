import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

// signup a new user
export const signup = async (req, res) => {
    const { fullname, email, password, bio } = req.body

    try {
        if (!fullname || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.json({ success: false, message: "Account already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        const { password: _, ...userData } = newUser._doc

        res.json({
            success: true,
            token,
            userData,
            message: "Account created successfully"
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userData = await User.findOne({ email })
        if (!userData) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const token = generateToken(userData._id)
        res.json({
            success: true,
            token,
            userData,
            message: "Login successful"
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//controller to check if user is authenticated
export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user })
}
//controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilepic, bio, fullname } = req.body
        const userId = req.user._id
        let updateUser
        if (!profilepic) {
            updateUser = await User.findByIdAndUpdate(userId, { bio, fullname }, { new: true })
        }
        else {
            const upload = await cloudinary.uploader.upload(profilepic)
            updateUser = await User.findByIdAndUpdate(userId, { profilepic: upload.secure_url, bio, fullname }, { new: true })
        }
        res.json({ success: true, user: updateUser })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}
