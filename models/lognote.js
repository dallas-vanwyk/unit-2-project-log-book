// models/lognote.js

// -------------------------------------------------------------- 

const mongoose = require('mongoose');

// const User = require('/user.js')

// -------------------------------------------------------------- 

const lognoteSchema = new mongoose.Schema({

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    createdTime: {
        type: Date,
    },

    inputTime: {
        type: Date,
    },

    contactName: {
        type: String,
    },

    contactType: {
        type: String,
        enum: [
            'internal',
            'external',
        ],
    },

    locationType: {
        type: String,
        enum: [
            'plant',
            'pipeline',
            'customer',
            'other',
        ],
    },

    locationName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    product: {
        type: String,
        enum: [
            'oxygen',
            'nitrogen',
            'hydrogen',
        ],
    },

    sendEmail: {
        type: Boolean,
    },

    sendText: {
        type: Boolean,
    },

    isCurrent: {
        type: Boolean,
    },

    incidentReport: {
        type: Boolean,
    },

    billingUpdate: {
        type: Boolean,
    },

    targetChange: {
        type: Boolean,
    },

    setpointChange: {
        type: Boolean,
    },

    playbookUpdate: {
        type: Boolean,
    },

    callRecording: {
        type: Boolean,
    },

    alarm: {
        type: Boolean,
    },

    isAOC: {
        type: Boolean,
    },
});

const Lognote = mongoose.model('Lognote', lognoteSchema);

module.exports = Lognote;

// -------------------------------------------------------------- 