// controllers/auth.js

// -------------------------------------------------------------- required modules

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

// -------------------------------------------------------------- r o u t e s

// -------------------------------------------------------------- Sign up page

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

// -------------------------------------------------------------- Sign up action (create user)

router.post('/sign-up', async (req, res) => {
    try {
        // check if username is taken
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send('user name is already in database');
        };

        if (req.body.password !== req.body.confirmPassword) {
            return res.send(`passwords don't match`);
        };

        // should I do any other password validations? minimum length, required characters?

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
        // dumb question but confirmPassword is still the original pw at this point right?
        // Does that constitue a security risk?

        await User.create(req.body);

        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.redirect('/'); // tbd
    }

});

// -------------------------------------------------------------- Sign in page

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

// -------------------------------------------------------------- Sign in action

router.post('/sign-in', async (req, res) => {
    try {

        const userInDatabase = await User.findOne({ username: req.body.username });
        if (!userInDatabase) {
            return res.send('Username and password do not match, please try again');
        };

        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );
        if (!validPassword) {
            return res.send('Username and password do not match, please try again')
        }

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };

        res.redirect('/'); // if sign-in was successful, redirect to lognote index

    } catch (error) {
        console.log(error);
        res.redirect('/'); // if sign-in was unsuccessful,land back at the sign-in page
    };
});

// -------------------------------------------------------------- Sign out action

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/'); // will go to the sign-in page
});

// -------------------------------------------------------------- export module

module.exports = router;

// -------------------------------------------------------------- 