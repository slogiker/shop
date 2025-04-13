const express = require('express');
const Order = require('../models/order');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.post('/add-to-basket', isAuthenticated, (req, res) => {
    const { name, quantity, priceBTC, priceETH } = req.body;
    if (!name || !quantity || !priceBTC || !priceETH) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    if (!req.session.basket) {
        req.session.basket = [];
    }
    const existingItem = req.session.basket.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        req.session.basket.push({ name, quantity, priceBTC, priceETH });
    }
    res.json({ success: true });
});

router.get('/get-basket', isAuthenticated, (req, res) => {
    res.json(req.session.basket || []);
});

router.post('/confirm-order', isAuthenticated, async (req, res) => {
    const {
            firstName, lastName, email, phone,
            billingStreet, billingCity, billingPostal, billingCountry,
            shippingStreet, shippingCity, shippingPostal, shippingCountry,
            paymentMethod, notes
        } = req.body;
    
        if (!firstName || !lastName || !email || !phone ||
            !billingStreet || !billingCity || !billingPostal || !billingCountry ||
            !shippingStreet || !shippingCity || !shippingPostal || !shippingCountry ||
            !paymentMethod || !['BTC', 'ETH'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'Invalid order data' });
        }
        if (!req.session.basket || req.session.basket.length === 0) {
            return res.status(400).json({ success: false, message: 'Basket is empty' });
        }
    
        let totalPrice = 0;
        const products = {};
        req.session.basket.forEach(item => {
            products[item.name] = item.quantity;
            totalPrice += item.quantity * (paymentMethod === 'BTC' ? item.priceBTC : item.priceETH);
        });
    
        const order = new Order({
            user: req.session.user.username,
            firstName,
            lastName,
            email,
            phone,
            billingStreet,
            billingCity,
            billingPostal,
            billingCountry,
            shippingStreet,
            shippingCity,
            shippingPostal,
            shippingCountry,
            products,
            totalPrice,
            paymentMethod,
            notes
        });
    
        try {
            await order.save();
            req.session.basket = [];
            res.json({ success: true, message: 'Order confirmed' });
        } catch (error) {
            console.error('Error saving order:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
});

module.exports = router;