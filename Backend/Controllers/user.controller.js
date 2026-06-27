import User from '../models/user.model.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existinguser = await User.findOne({ email });
        if (existinguser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        let image = { public_id: "", url: "" };

        if (req.file) {
            const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            image = {
                public_id: req.file.filename,
                url: imageUrl,
            };
        }

        const user = await User.create({
            name,
            email,
            password: hashedpassword,
            image
        });


        const userResponse = { ...user._doc };
        delete userResponse.password;

        res.status(201).json({ message: "User created successfully", user: userResponse, success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ message: "Invalid password", success: false });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const userResponse = { ...user._doc };
        delete userResponse.password;

        res.status(200).json({ message: "Login successful", user: userResponse, token, success: true });

    } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
}
}