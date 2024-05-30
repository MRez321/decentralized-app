require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const { v4: uuid } = require('uuid');

const port = process.env.PORT || 3000;
const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_DB,
    collection: 'sessions',
    // expires: 43200,
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // cb(null, new Date().toISOString() + '-' + file.originalname);
        // cb(null, file.originalname);
        cb(null, uuid() + ' - ' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    console.log('req file =>', req.file);
    console.log('req files =>', req.files);
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/webp' 
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: fileStorage, 
    fileFilter: fileFilter
});
app.use(upload.single('image'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
    secret: 'long string secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {maxAge: 43200},
}));

// app.use(upload.single('image'));
// app.use(upload.array('image', 20));



// Cheking Session Status
app.use((req, res, next) => {
    if (req.session) {
        console.log('Session ID:', req.sessionID);
        console.log('Session isLoggedIn:', req.session.isLoggedIn);
    } else {
        console.log('No session found');
    }
    next();
});



app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

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
        next(new Error(err));
    });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');

    console.log('Error middleware triggered');
    if (req.session) {
        console.log('Session ID:', req.sessionID);
        console.log('Session isLoggedIn:', req.session.isLoggedIn);
    } else {
        console.log('No session found');
    }

    res.status(500).render('500', { 
        pageTitle: 'Error!', 
        path: '/500',
        // isAuthenticated: req.session.isLoggedIn,
        isAuthenticated: req.session ? req.session.isLoggedIn : false,
    });
});

// mongoose.connect(process.env.MONGO_DB)
mongoose.connect(`${process.env.MONGO_DB}`)
.then(result => {
    console.log('connected to mongodb');

    app.listen(port, () => console.log(`Server running on Port ${port}`, `=> http://localhost:${port}/`));
})
.catch(err => console.log(err));