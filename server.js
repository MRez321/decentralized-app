require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

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

app.use((req, res, next) => {
    User.findById('664517c9440587738956e7d3')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});






app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.get404);


// app.listen(port, () => console.log(`Server running on Port ${port}`, `=> http://localhost:${port}/`));

mongoose.connect('mongodb://root:3M6L6BrZmqLn18bbmmoaX2nP@monte-rosa.liara.cloud:31878/shop?authSource=admin&replicaSet=rs0&directConnection=true')
.then(result => {
    console.log('connected to mongodb');


    User.findOne()
    .then(user => {
        if (!user) {
            const user = new User({
                name: 'MRez',
                email: 'MRez321@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    .catch(err => console.log(err));




    app.listen(port, () => console.log(`Server running on Port ${port}`, `=> http://localhost:${port}/`));
})
.catch(err => console.log(err));