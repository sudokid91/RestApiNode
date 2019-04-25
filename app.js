const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

mongoose.connect(`mongodb://max:${process.env.MONGO_PASSWORD}@cluster0-rar0y.mongodb.net/test?retryWrites=true`);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allows-Origin', '*');
    res.header('Origin','X-Requests-With','Content-Type','Accept','Authorization');
    if(req.method ===   'OPTIONS') {
        res.header('Access-Control-Allows-Methods','GET, POST,PATCH,PUT,DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
   next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message  
        }
    });
});
module.exports = app;