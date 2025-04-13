const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    user: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    billingStreet: String,
    billingCity: String,
    billingPostal: String,
    billingCountry: String,
    shippingStreet: String,
    shippingCity: String,
    shippingPostal: String,
    shippingCountry: String,
    products: { type: Map, of: Number },
    totalPrice: Number,
    paymentMethod: String,
    notes: String,
    status: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Order', orderSchema);