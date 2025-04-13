const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password, passwordRepeat } = req.body;
    console.log('Register attempt:', { username, email });
    if (!username || !email || !password || !passwordRepeat) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (password !== passwordRepeat) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        req.session.user = { username };
        console.log('Register success, session set:', req.session.user);
        res.json({ success: true });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
        req.session.user = { username };
        console.log('Login success, session set:', req.session.user);
        res.json({ success: true });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/logout', (req, res) => {
    console.log('Logout attempt');
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, message: 'Could not log out' });
        }
        console.log('Logout success');
        res.json({ success: true });
    });
});

module.exports = router;