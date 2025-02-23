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
    res.send(`lognotes index route`);
});

// -------------------------------------------------------------- New

router.get('/new', (req, res) => {
    // res.send('new log note form');
    res.render('lognotes/new.ejs');
});

// -------------------------------------------------------------- Delete

router.delete('/:lognoteId', async (req, res) => {
    res.send('delete route');
});

// -------------------------------------------------------------- Update

router.put('/:lognoteId/edit', async (req, res) => {
    res.send('edit route');
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

router.get('/:lognoteId/edit', (req, res) => {
    res.send('edit route');
});


// -------------------------------------------------------------- Show

router.get('/:lognoteId', (req, res) => {
    res.send('show route')
});


// -------------------------------------------------------------- export router

module.exports = router;
