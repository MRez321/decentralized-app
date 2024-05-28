const express = require('express');

const authController = require('../controllers/auth');

const Router = express.Router();



Router.get('/login', authController.getLogin);

Router.post('/login', authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);

Router.post('/signup', authController.postSignup);

Router.get('/reset', authController.getReset);

Router.post('/reset', authController.postReset);

Router.get('/reset/:token', authController.getNewPassword);

Router.post('/new-password', authController.postNewPassword);

module.exports = Router;