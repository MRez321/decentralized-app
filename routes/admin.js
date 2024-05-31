const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const Router = express.Router();


const addProductValidator = [
    body('title')
    .isString()
    .isLength({min: 3})
    .trim(),

    // body('imageUrl')
    // .isURL(),

    body('price')
    .isFloat(),

    body('description')
    .isLength({min: 5, max: 400})
    .trim(),
];


// all these routes have /admin in front of them
Router.get('/add-product', isAuth, adminController.getAddProduct);

Router.post('/add-product', addProductValidator, isAuth, adminController.postAddProduct);

Router.get('/products', isAuth, adminController.getProducts);

Router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

Router.post('/edit-product', addProductValidator, isAuth, adminController.postEditProduct);

Router.post('/delete-product', isAuth, adminController.postDeleteProduct);
Router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = Router;
