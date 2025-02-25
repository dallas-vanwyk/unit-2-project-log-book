// controllers/auth.js

// -------------------------------------------------------------- required modules

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

// -------------------------------------------------------------- r o u t e s

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

// -------------------------------------------------------------- change password page

router.get('/change-password', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('auth/change-password.ejs', {
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- change password action

router.put('/change-password', async (req, res) => {
    try {

        const user = await User.findById(req.session.user._id);

        const validPassword = bcrypt.compareSync(
            req.body.oldPassword,
            user.password
        );
        if (!validPassword) {
            return res.send('Old password incorrect, please try again')
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.send(`New passwords don't match, please try again`);
        };

        // implement same pw requirements/validations should apply here

        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;

        await User.findByIdAndUpdate(
            user._id,
            { password: req.body.password },
            { new: true },
        );

        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.redirect('/auth/change-password');
    };
});

// -------------------------------------------------------------- Sign out action

router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/'); // will go to the sign-in page
});

// -------------------------------------------------------------- New user page

router.get('/new-user', async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    if (currentUser.role === 'admin') {
        res.render('auth/new-user.ejs');
    } else {
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Create user action

router.post('/create-user', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin') {

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

            res.redirect('/auth/view-users');

        } else {
            res.redirect('/');
        };

    } catch (error) {
        console.log(error);
        res.redirect('/'); // tbd
    }
});

// -------------------------------------------------------------- view all users

router.get('/view-users', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    if (user.role === 'admin') {
        const users = await User.find();
        res.render('auth/view-users.ejs', {
            users: users,
        });
    } else {
        res.redirect('/');
    };
});

// -------------------------------------------------------------- edit user

router.get('/:userId/edit-user', async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);

    if (currentUser.role === 'admin') {
        const user = await User.findById(req.params.userId);
        res.render('auth/edit-user.ejs', {
            user: user,
        });

    } else {
        res.redirect('/');
    };
});

// -------------------------------------------------------------- update user

router.put('/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin') {

            // check if editing user is in database
            const userInDatabase = await User.findOne({ _id: req.params.userId });
            if (!userInDatabase) {
                return res.send('user is not in database');
            };

            // check if passwords match each other
            if (req.body.password !== req.body.confirmPassword) {
                return res.send(`passwords don't match`);
            };

            const user = await User.findById(req.params.userId);

            // check if password was changed
            if (req.body.password !== user.password) {
                // does re-hash password ONLY if it was updated
                const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                req.body.password = hashedPassword;
            };

            user.set(req.body);

            await user.save();

            res.redirect('/auth/view-users');

        } else {
            res.redirect('/');
        };

    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- delete user

router.delete('/:userId', async (req, res) => {
    try {
        // should add some manner of confirmation here...
        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin') {

            await User.findByIdAndDelete(req.params.userId);

            res.redirect('/auth/view-users');

        } else {
            res.redirect('/');
        };

    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
});


// -------------------------------------------------------------- export module

module.exports = router;

// -------------------------------------------------------------- 