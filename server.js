// server.js

// -------------------------------------------------------------- required modules

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');


// -------------------------------------------------------------- other files...

// const authController = require('./controllers/auth.js');
// const isSignedIn = require('/middleware/is-signed-in.js');
// const passUserToView = require('/middleware/pass-user-to-view.js');
// const lognotesController = require('./controllers/lognotes.js');

// -------------------------------------------------------------- other parameters

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// -------------------------------------------------------------- middleware


// -------------------------------------------------------------- routes

app.get('/', (req, res) => {
    // start at the sign in page
    res.render('/views/auth/sign-in.ejs');

    // if signed in, go to log notes page

});



// -------------------------------------------------------------- port listener

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}.`);
});

// -------------------------------------------------------------- 
// -------------------------------------------------------------- 