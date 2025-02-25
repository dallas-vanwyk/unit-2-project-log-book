// controllers/lognotes.js

// -------------------------------------------------------------- imports, requirements

const express = require('express');
const router = express.Router();

// import User model
const User = require('../models/user.js');

// import Lognote model
const Lognote = require('../models/lognote.js');

// -------------------------------------------------------------- r o u t e s

// -------------------------------------------------------------- Index

router.get('/', async (req, res) => {
    if (req.session.user) {
        const lognotes = await Lognote.find();
        res.render('lognotes/index.ejs', {
            lognotes: lognotes,
        });
    } else {
        res.redirect('/auth/sign-in.ejs');
    };
});

// -------------------------------------------------------------- New

router.get('/new', async (req, res) => {
    if (req.session.user) {
        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin' || currentUser.role === 'editor') {
            res.render('lognotes/new.ejs', {
                user: currentUser,
            });
        } else {
            res.redirect('/');
        };
    } else {
        res.redirect('/auth/sign-in.ejs');
    };
});

// -------------------------------------------------------------- Delete

router.delete('/:lognoteId', async (req, res) => {
    try {
        // this should have some sort of confirmation double-check

        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin' || currentUser.role === 'editor') {
            await Lognote.findByIdAndDelete(req.params.lognoteId);
        };
        res.redirect('/lognotes');

    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Update

router.put('/:lognoteId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        if (currentUser.role === 'admin' || currentUser.role === 'editor') {
            const lognote = await Lognote.findById(req.params.lognoteId);
            lognote.set(req.body);
            await lognote.save();
            res.redirect('/lognotes');
        } else {
            res.redirect('/');
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Create

router.post('/', async (req, res) => {
    try {
        // auto-fill the creator

        // auto-generate the created timestamp

        // turn check boxes into true/false
        // parse dates & times

        const currentUser = await User.findById(req.session.user._id);

        if (currentUser.role === 'admin' || currentUser.role === 'editor') {
            await Lognote.create(req.body);
            res.redirect('/lognotes');
        } else {
            res.redirect('/');
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Edit

router.get('/:lognoteId/edit', async (req, res) => {
    if (req.session.user) {
        try {

            const currentUser = await User.findById(req.session.user._id);
            if (currentUser.role === 'admin' || currentUser.role === 'editor') {

                const lognote = await Lognote.findById(req.params.lognoteId);
                res.render('lognotes/edit.ejs', {
                    lognote: lognote,
                });

            } else {
                res.redirect('/');
            };

        } catch (error) {
            console.log(error);
            res.redirect('/');
        };
    } else {
        // start at the sign in page
        res.redirect('/auth/sign-in.ejs');
    };
});

// -------------------------------------------------------------- Show

router.get('/:lognoteId', async (req, res) => {
    if (req.session.user) {
        try {
            const lognote = await Lognote.findById(req.params.lognoteId);

            res.render('lognotes/show.ejs', {
                lognote: lognote,
            });

        } catch (error) {
            console.log(error);
            res.redirect('/');
        };
    } else {
        // start at the sign in page
        res.redirect('/auth/sign-in.ejs');
    };
});

// -------------------------------------------------------------- export router

module.exports = router;
