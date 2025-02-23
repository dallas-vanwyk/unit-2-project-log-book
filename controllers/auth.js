// controllers/auth.js

// -------------------------------------------------------------- required modules

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

// -------------------------------------------------------------- routes

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

// neeeeeeeeed to figure out how this piles in to everything else
router.get('/create-user', (req, res) => {
    res.render('auth/create-user.ejs');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/'); // could go to sign-in page but w/e
});

// -------------------------------------------------------------- CREATE USER

router.post('/create-user', async (req, res) => {
    console.log(`made it to here`)
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
        // dumb question but confirmPassword is still the original pw at this point right? Does that constitue a security risk?

        await User.create(req.body);
        
        res.redirect('/auth/create-user'); // probably change this to the user list

    } catch (error) {
        console.log(error);
        res.redirect('/auth/create-user'); // tbd
    }
});

// -------------------------------------------------------------- SIGN IN

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

        res.redirect('/');
        // res.send('sign in successful');

    } catch (error) {
        console.log(error);
        res.redirect('/'); // this could just directly redirect to the sign-in page but idc
    };
});









// -------------------------------------------------------------- export module

module.exports = router;

// -------------------------------------------------------------- 