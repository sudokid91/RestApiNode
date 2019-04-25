const express = require('express');

const route = express.Router();

route.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET orders'
    });
});

route.post('/', (req, res, next) => {
    const order = {
        productId : req.body.productId, 
        quantity : req.body.quantity
    }
    res.status(201).json({
        message: 'Handling POST orders',
        createOrder : order
    });
});

route.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    if(id === 'sudokid') {
        res.status(200).json({
            message: 'You discoverd id is sudokid',
            id
        });
    } else {
        res.status(200).json({
            message: 'Not found',
            id
        });
    }
    
});
route.patch('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling UPDATE orders'
    });
});
route.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Handling DELETE orders'
    });
});
module.exports = route;