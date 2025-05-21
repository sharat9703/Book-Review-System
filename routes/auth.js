// Authentication routes: signup & login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) return res.status(400).json({ status : 'success',message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        await user.save();
        res.status(201).json({ status : 'success',message: `User registered with id ${user._id}` });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess',message: 'Error encountered while signing up',error: err.message });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ status : 'unsuccess',message: 'Invalid credentials' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ status : 'unsuccess',message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ status : 'success', token : token });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ status : 'unsuccess',message: 'Error encountered while logging in', error: err.message });
    }
});

module.exports = router;
