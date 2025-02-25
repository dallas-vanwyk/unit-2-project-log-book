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

const port = process.env.PORT ? process.env.PORT : "3000";

// JS controllers for auth, user accounts, and log note CRUDs
const authController = require('./controllers/auth.js');
const lognotesController = require('./controllers/lognotes.js');
const usersController = require('./controllers/users.js');

// my middleware files
const passUserToView = require('./middleware/pass-user-to-view.js');
const checkAccount = require('./middleware/check-account.js');

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
// note: this must remain ABOVE the checkAccount and passUSer middleware
app.use('/auth', authController);




// checks if user signed in; if not, redirect to sign-in page
app.use(checkAccount);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.use(passUserToView);




// lognotesController for log notes CRUDs
app.use('/lognotes', lognotesController)

// usersController for user accounts CRUDs
app.use('/users', usersController)



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
