require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const User = require("../models/user");


// SMTP configuration
const smtpConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
};
const transporter = nodemailer.createTransport(smtpConfig);



exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '', 
        },
        validationErrors: [],
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password, 
            },
            validationErrors: errors.array(),
        });
    }

    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            // req.flash('error', 'Invalid email or password');
            // return res.redirect('/login');
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password, 
                },
                validationErrors: [],
            });
        }

        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                })
            }
            // req.flash('error', 'Invalid email or password.');
            // res.redirect('/login');
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Invalid email or password',
                oldInput: {
                    email: email,
                    password: password, 
                },
                validationErrors: [],
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        // isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: '', 
            confirmPassword: '',
        },
        validationErrors: [],
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'SignUp',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password, 
                confirmPassword: confirmPassword,
            },
            validationErrors: errors.array(),
        });
    }

    // User.findOne({email: email})
    // .then(userDoc => {
    //     if (userDoc) {
    //         req.flash('error', 'E-mail already exists, please pick another one.');
    //         return res.redirect('/signup');
    //     }

        // return bcrypt.hash(password, 12)
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] },
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');

            const mailOptions = {
                from: 'info@pixelstar.ir',
                to: email,
                subject: 'SignUp Successful!',
                text: 'You SignUp Successfully!',
                html: '<h1>You SignUp Successfully!</h1>'
            }
            return transporter.sendMail(mailOptions)
            .then(() => console.log('OK, Email has been sent.'))
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });                              
        })
    // })
    // .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
        csrfToken: req.csrfToken(),
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found!');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();

        })
        .then(result => {
            res.redirect('/');
            const mailOptions = {
                from: 'info@pixelstar.ir',
                to: req.body.email,
                subject: 'Password Reset',
                text: 'Password Reset Request!',
                html: `
                    <p>You requested a password Reset</p>
                    <p>Click the link below to set a new password</p>
                    <a href="http://localhost:3000/reset/${token}">Reset Password</a>

                `
            }
            transporter.sendMail(mailOptions)
            .then(() => console.log('OK, Email has been sent.'))
            .catch(err => console.log(err));
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
        resetToken: token,
        resetTokenExpiration: {$gt: Date.now()}
    })
    .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
    
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: message,
            csrfToken: req.csrfToken(),
            userId: user._id.toString(),
            passwordToken: token,
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId,
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}