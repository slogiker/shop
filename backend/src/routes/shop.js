const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const Order = require('../models/order');
const router = express.Router();

// Add to basket
router.post('/add-to-basket', isAuthenticated, async (req, res) => {
    try {
        const { name, quantity, priceBTC, priceETH } = req.body;
        console.log('Received add-to-basket:', { name, quantity, priceBTC, priceETH });

        if (!name || !quantity || quantity < 1 || !priceBTC || !priceETH) {
            console.error('Invalid basket data:', req.body);
            return res.status(400).json({ success: false, message: 'Invalid item data' });
        }

        const username = req.session.user.username;
        let order = await Order.findOne({ user: username, status: 'pending' });
        if (!order) {
            order = new Order({
                user: username,
                products: new Map(),
                totalPrice: 0,
                status: 'pending'
            });
        }

        const currentQuantity = order.products.get(name) || 0;
        order.products.set(name, currentQuantity + parseInt(quantity, 10));
        order.totalPrice += quantity * parseFloat(priceBTC);
        await order.save();

        console.log('Basket updated:', order);
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to basket:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get basket
router.get('/get-basket', isAuthenticated, async (req, res) => {
    try {
        const username = req.session.user.username;
        const order = await Order.findOne({ user: username, status: 'pending' });
        if (!order) {
            return res.json([]);
        }
        const basket = Array.from(order.products.entries()).map(([name, quantity]) => ({
            name,
            quantity,
            priceBTC: 0,
            priceETH: 0
        }));
        res.json(basket);
    } catch (error) {
        console.error('Error fetching basket:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Confirm order
router.post('/confirm-order', isAuthenticated, async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone, billingStreet, billingCity, billingPostal, billingCountry,
            shippingStreet, shippingCity, shippingPostal, shippingCountry, paymentMethod, notes
        } = req.body;
        if (!firstName || !lastName || !email || !phone || !billingStreet || !billingCity || !billingPostal || !billingCountry ||
            !shippingStreet || !shippingCity || !shippingPostal || !shippingCountry || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const username = req.session.user.username;
        const order = await Order.findOne({ user: username, status: 'pending' });
        if (!order) {
            return res.status(400).json({ success: false, message: 'No pending order found' });
        }
        order.firstName = firstName;
        order.lastName = lastName;
        order.email = email;
        order.phone = phone;
        order.billingStreet = billingStreet;
        order.billingCity = billingCity;
        order.billingPostal = billingPostal;
        order.billingCountry = billingCountry;
        order.shippingStreet = shippingStreet;
        order.shippingCity = shippingCity;
        order.shippingPostal = shippingPostal;
        order.shippingCountry = shippingCountry;
        order.paymentMethod = paymentMethod;
        order.notes = notes;
        order.status = 'confirmed';
        await order.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update quantity of an item in basket (quantity=0 removes it)
router.post('/update-quantity', isAuthenticated, async (req, res) => {
    try {
        const { name, quantity, priceBTC } = req.body;
        if (!name || quantity === undefined || !priceBTC) {
            return res.status(400).json({ success: false, message: 'Invalid data' });
        }
        const username = req.session.user.username;
        const order = await Order.findOne({ user: username, status: 'pending' });
        if (!order) return res.status(404).json({ success: false, message: 'No basket found' });

        const oldQty = order.products.get(name) || 0;
        const newQty = parseInt(quantity, 10);

        if (newQty <= 0) {
            order.products.delete(name);
        } else {
            order.products.set(name, newQty);
        }
        order.totalPrice = Math.max(0, order.totalPrice + (newQty - oldQty) * parseFloat(priceBTC));
        await order.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Remove item from basket
router.post('/remove-from-basket', isAuthenticated, async (req, res) => {
    try {
        const { name, priceBTC } = req.body;
        if (!name || !priceBTC) return res.status(400).json({ success: false, message: 'Invalid data' });
        const username = req.session.user.username;
        const order = await Order.findOne({ user: username, status: 'pending' });
        if (!order) return res.status(404).json({ success: false, message: 'No basket found' });

        const qty = order.products.get(name) || 0;
        order.products.delete(name);
        order.totalPrice = Math.max(0, order.totalPrice - qty * parseFloat(priceBTC));
        await order.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing from basket:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;