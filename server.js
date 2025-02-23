// server.js

// -------------------------------------------------------------- required modules

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

const mongoose = require('mongoose');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const morgan = require('morgan');
app.use(morgan('dev'));

const session = require('express-session');
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);


// -------------------------------------------------------------- other files...

const authController = require('./controllers/auth.js');
app.use('/auth', authController);

const isSignedIn = require('./middleware/is-signed-in.js');
app.use(isSignedIn);

const passUserToView = require('./middleware/pass-user-to-view.js');
app.use(passUserToView);

const lognotesController = require('./controllers/lognotes.js');
app.use('/lognotes', lognotesController)


// -------------------------------------------------------------- other parameters

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



// -------------------------------------------------------------- middleware ..... ?


// -------------------------------------------------------------- routes

app.get('/', (req, res) => {
    if (req.session.user) {
        // if signed in, go to log notes page
        res.render('index.ejs');
        // res.render('index.ejs');
    } else {
        // start at the sign in page
        res.render('auth/sign-in.ejs');
        // res.render('index.ejs');
    };
});






// -------------------------------------------------------------- port listener

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}.`);
});

// -------------------------------------------------------------- 
// -------------------------------------------------------------- 