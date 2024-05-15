const path = require('path');

const express = require('express');
// const { title } = require('process');

const adminController = require('../controllers/admin');

const Router = express.Router();


// all these routes have /admin infront of them
Router.get('/products', adminController.getProducts);

Router.get('/add-product', adminController.getAddProduct);

Router.post('/add-product', adminController.postAddProduct);

Router.get('/edit-product/:productId', adminController.getEditProduct);

Router.post('/edit-product', adminController.postEditProduct);

Router.post('/delete-product', adminController.postDeleteProduct);

module.exports = Router;
