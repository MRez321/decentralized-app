require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');


const port = process.env.PORT || 3000;
const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_DB,
    collection: 'sessions',
    expires: 43200,
});

const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'long string secret',
    resave: false,
    saveUninitialized: false,
    // cookie: {maxAge: 43200},
    store: store,
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }

    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        throw new Error(err);
    });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});




app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);


// app.listen(port, () => console.log(`Server running on Port ${port}`, `=> http://localhost:${port}/`));

// mongoose.connect(process.env.MONGO_DB)
mongoose.connect(`${process.env.MONGO_DB}`)
.then(result => {
    console.log('connected to mongodb');


    // User.findOne()
    // .then(user => {
    //     if (!user) {
    //         const user = new User({
    //             name: 'MRez',
    //             email: 'MRez321@gmail.com',
    //             cart: {
    //                 items: []
    //             }
    //         });
    //         user.save();
    //     }
    // })
    // .catch(err => console.log(err));




    app.listen(port, () => console.log(`Server running on Port ${port}`, `=> http://localhost:${port}/`));
})
.catch(err => console.log(err));