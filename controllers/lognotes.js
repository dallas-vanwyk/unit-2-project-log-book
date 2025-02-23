// controllers/lognotes.js

// -------------------------------------------------------------- imports, requirements

const express = require('express');
const router = express.Router();

// import User model
const User = require('../models/user.js');

// import Lognote model
const Lognote = require('../models/lognote.js');

// -------------------------------------------------------------- Routes

// -------------------------------------------------------------- Index

router.get('/', async (req, res) => {
    // res.send(`lognotes index route`);

    // add logic to check if logged in

    const lognotes = await Lognote.find();

    res.render('lognotes/index.ejs', {
        lognotes: lognotes,
    });
});

// -------------------------------------------------------------- New

router.get('/new', (req, res) => {
    // res.send('new log note form');
    // add logic to check if logged in
    res.render('lognotes/new.ejs');
});

// -------------------------------------------------------------- Delete

router.delete('/:lognoteId', async (req, res) => {
    try {
        // this should have some sort of confirmation double-check
        await Lognote.findByIdAndDelete(req.params.lognoteId);
        res.redirect('/lognotes');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Update

router.put('/:lognoteId', async (req, res) => {

    try {
        
        const lognote = await Lognote.findById(req.params.lognoteId);

        lognote.set(req.body);

        await lognote.save();
        
        res.redirect('/lognotes');

    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Create

router.post('/', async (req, res) => {

    try {

        // auto-fill the creator
        // const currentUser = await User.findById(req.session.user._id);

        // auto-generate the created timestamp


        // turn check boxes into true/false
        // parse dates & times

        await Lognote.create(req.body);

        res.redirect('/lognotes');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});

// -------------------------------------------------------------- Edit

router.get('/:lognoteId/edit', async (req, res) => {
    // res.send('edit route');
    
    try {

        const lognote = await Lognote.findById(req.params.lognoteId);
        
        res.render('lognotes/edit.ejs', {
            lognote: lognote,
        });

    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});


// -------------------------------------------------------------- Show

router.get('/:lognoteId', async (req, res) => {
    // res.send('show route')

    try {
        const lognote = await Lognote.findById(req.params.lognoteId);
        
        res.render('lognotes/show.ejs', {
            lognote: lognote,
        });

    } catch (error) {
        console.log(error);
        res.redirect('/');
    };
});


// -------------------------------------------------------------- export router

module.exports = router;
