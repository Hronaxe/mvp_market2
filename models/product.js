const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const productSchema = new Schema({
    Produs: String,
    Pret: Number,
    Description: String
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;