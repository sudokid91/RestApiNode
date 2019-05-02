const express = require('express');
const route = express.Router();

const checkAuth =require('../middleware/check-auth');

const OrderController = require('../controllers/order');

route.get('/',checkAuth, OrderController.get_order_all);
route.post('/', checkAuth, OrderController.post_order);
route.get('/:orderId', checkAuth, OrderController.get_order_byId);
route.patch('/:orderId',checkAuth, OrderController.update_order);
route.delete('/:orderId',checkAuth, OrderController.delete_order);

module.exports = route;