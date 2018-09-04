'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
const express = require('express');
const app = express();
/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    console.log('edit');
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    res.status(200).send('Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    console.log('save');
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    res.status(200).send('Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    console.log('execute');
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    res.status(200).send('Execute');
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    console.log(req);
    console.log('publish');
    res.status(200).send('Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    console.log('validate');
    res.status(200).send('Validate');
};

exports.stop = function(req, res) {
    console.log('stop');
    res.status(200).send('Stop');

}