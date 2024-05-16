const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();

Router.get('/', shopController.getIndex);

Router.get('/products', shopController.getProducts);

Router.get('/products/:productId', shopController.getProduct);

Router.get('/cart', isAuth, shopController.getCart);

Router.post('/cart', isAuth, shopController.postCart);

Router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

Router.post('/create-order', isAuth, shopController.postOrder);

Router.get('/orders', isAuth, shopController.getOrders);

module.exports = Router;
