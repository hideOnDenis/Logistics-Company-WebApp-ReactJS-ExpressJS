import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const router = Router();

router.post('/api/register', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists");
        }
        user = new User({ email, password });
        await user.save();
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error in saving");
    }
});

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password");
        }
        console.log(process.env.JWT_SECRET);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, email: user.email, id: user._id, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

export default router;