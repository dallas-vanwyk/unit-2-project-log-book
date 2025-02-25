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

const path = require('path');

const authController = require('./controllers/auth.js');

const port = process.env.PORT ? process.env.PORT : "3000";

// -------------------------------------------------------------- other parameters

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    // deliberately leaving this console.log in place
    // (not ignoring the project requirements)
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// -------------------------------------------------------------- middleware

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// morgan for logs for debugging
app.use(morgan('dev'));

// public folder path for stylesheet
app.use(express.static(path.join(__dirname, "public")));

// authController for all session authentication, including sign-in page
app.use('/auth', authController);

// check
const checkAccount = require('./middleware/check-account.js');
app.use(checkAccount);



const passUserToView = require('./middleware/pass-user-to-view.js');
app.use(passUserToView);

// lognotesController for all log note views and functionality
const lognotesController = require('./controllers/lognotes.js');
app.use('/lognotes', lognotesController)


// -------------------------------------------------------------- routes

// the root route directs to the lognote index if signed in
// there is no need for a 'home page'
// /index.ejs is unused at this time; maintained for possible future use
app.get('/', (req, res) => {
    res.redirect('/lognotes');
});

// -------------------------------------------------------------- port listener

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}.`);
});

// -------------------------------------------------------------- 
