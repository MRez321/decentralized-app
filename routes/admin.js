const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();

// all these routes have /admin in front of them
Router.get('/add-product', isAuth, adminController.getAddProduct);

Router.post('/add-product', isAuth, adminController.postAddProduct);

Router.get('/products', isAuth, adminController.getProducts);

Router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

Router.post('/edit-product', isAuth, adminController.postEditProduct);

Router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = Router;
