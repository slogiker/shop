const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
   const { username, email, password, passwordRepeat } = req.body;
       if (!username || !email || !password || !passwordRepeat) {
           return res.status(400).send('All fields are required');
       }
       if (password !== passwordRepeat) {
           return res.status(400).send('Passwords do not match');
       }
       try {
           const existingUser = await User.findOne({ $or: [{ username }, { email }] });
           if (existingUser) {
               return res.status(400).send('Username or email already exists');
           }
           const salt = bcrypt.genSaltSync(10);
           const hashedPassword = bcrypt.hashSync(password, salt);
           const newUser = new User({ username, email, password: hashedPassword });
           await newUser.save();
           res.redirect('/login.html');
       } catch (error) {
           console.error('Error during registration:', error);
           res.status(500).send('Server error');
       }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        try {
            const user = await User.findOne({ username });
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(400).send('Invalid credentials');
            }
            req.session.user = { username };
            res.redirect('/shop.html');
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Server error');
        }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.status(200).send('Logged out');
    });
});

module.exports = router;