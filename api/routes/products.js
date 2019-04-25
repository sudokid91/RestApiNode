const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');

const Product = require("../models/product");

route.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET products'
    });
});

route.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
   
    product.save().
    then(result => {
        console.log(result);
    }) 
    .catch( err => console.log(err));
    res.status(201).json({
        message: 'Handling POST products',
        createProduct : product
    });
});

route.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if(id === 'special') {
        res.status(200).json({
            message: 'You discoverd id is special',
            id
        });
    } else {
        res.status(200).json({
            message: 'Not found',
            id
        });
    }
    
});
route.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling UPDATE products'
    });
});
route.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling DELETE products'
    });
});
module.exports = route;