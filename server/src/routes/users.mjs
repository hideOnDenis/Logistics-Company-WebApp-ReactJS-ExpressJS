import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth } from "../utils/middlewares.mjs";


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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, email: user.email, id: user._id, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }


});

router.get('/api/users', async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({}, '-password'); // Exclude passwords from the result
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Example route in your users router file

router.patch('/api/users/toggleAdmin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.isAdmin = !user.isAdmin;
        await user.save();
        res.status(200).json({ id: user._id, email: user.email, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});




export default router;