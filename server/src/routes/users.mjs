import { Router } from "express";
import { User } from "../mongoose/schemas/User.mjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { auth, adminAuth } from "../utils/middlewares.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { checkSchema, validationResult } from "express-validator";


const router = Router();


// Register user
router.post('/api/register', checkSchema(createUserValidationSchema), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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


// Login user
router.post('/api/login', checkSchema(createUserValidationSchema), async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, email: user.email, id: user._id, isAdmin: user.isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }


});

// Get all users
router.get('/api/users', adminAuth, async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find({}, '-password'); // Exclude passwords from the result
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


// isAdmin toggle
router.patch('/api/users/toggleAdmin/:id', adminAuth, async (req, res) => {
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

// Delete user
router.delete('/api/users/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        // Find the user by ID and delete them from the database
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        await User.findByIdAndDelete(id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).send('Invalid user ID');
        }
        res.status(500).send('Server error');
    }
});





export default router;