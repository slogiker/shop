const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Order = require('../models/order');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password, passwordRepeat, dob } = req.body;
    console.log('Register attempt:', { username, email, dob });
    if (!username || !email || !password || !passwordRepeat || !dob) {
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
        const newUser = new User({ username, email, password: hashedPassword, dob });
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

router.get('/orders', isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user.username;
        const orders = await Order.find({ user: username, status: 'confirmed' }).sort({ timestamp: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/change-username', isAuthenticated, async (req, res) => {
    const { newUsername } = req.body;
    if (!newUsername) return res.status(400).json({ message: 'New username is required' });
    try {
        const existing = await User.findOne({ username: newUsername });
        if (existing) return res.status(400).json({ message: 'Username already taken' });
        const current = req.session.user.username;
        await User.updateOne({ username: current }, { username: newUsername });
        await Order.updateMany({ user: current }, { user: newUsername });
        req.session.user.username = newUsername;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/change-password', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'All fields required' });
    try {
        const user = await User.findOne({ username: req.session.user.username });
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete-account', isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user.username;
        await User.deleteOne({ username });
        await Order.deleteMany({ user: username });
        req.session.destroy();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;