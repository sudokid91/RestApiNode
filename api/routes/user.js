const express = require('express');
const route = express.Router();

const UserController = require('../controllers/user');

route.post('/signup', UserController.user_signup);

route.post('/login', UserController.user_login);

route.delete('/:userId', UserController.user_delete);

module.exports = route;