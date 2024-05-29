const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const Router = express.Router();


const signupValidator = [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {req}) => {
        // if (value === 'MRez321@gmail.com') {
        //     throw new Error('This email adress is not allowed!');
        // }
        // return true;
        return User.findOne({email: value})
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-mail already exists, please pick another one.');
            }
        })
    })
    .normalizeEmail(),
    
    body(
        'password',
        'please enter a password with only numbers and text and at lease 6 charecters'
    )
    .isLength({min: 6})
    .isAlphanumeric()
    .trim(),

    body('confirmPassword')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
    .trim(),
];

const loginValidator = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email adress.')
    .normalizeEmail(),

    body('password', 'password has to be valid!')
    .isLength({min: 6})
    .isAlphanumeric()
    .trim(),
];


Router.get('/login', authController.getLogin);

Router.post('/login', loginValidator, authController.postLogin);

Router.post('/logout', authController.postLogout);

Router.get('/signup', authController.getSignup);

Router.post('/signup', signupValidator, authController.postSignup);

Router.get('/reset', authController.getReset);

Router.post('/reset', authController.postReset);

Router.get('/reset/:token', authController.getNewPassword);

Router.post('/new-password', authController.postNewPassword);

module.exports = Router;