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

const authController = require('./controllers/auth.js');
const isSignedIn = require('/middleware/is-signed-in.js');
const passUserToView = require('/middleware/pass-user-to-view.js');
const lognotesController = require('./controllers/lognotes.js');









// -------------------------------------------------------------- middleware


// -------------------------------------------------------------- routes


// -------------------------------------------------------------- port listener





// -------------------------------------------------------------- 
// -------------------------------------------------------------- 
// -------------------------------------------------------------- 
// -------------------------------------------------------------- 