const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Serving static files from "public" folder
app.use(express.static('public'));

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://admin:cMefVOUAeETxn3TZ@cluster0-6cyao.mongodb.net/sudokid?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:cMefVOUAeETxn3TZ@cluster0-6cyao.mongodb.net/test?retryWrites=true";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
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
app.use('/user', userRoutes);

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

//general docs api: apidoc -e "(node_modules|public)" -o public/apidoc
