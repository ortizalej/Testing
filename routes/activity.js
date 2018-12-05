    'use strict';
    var util = require('util');

    // Deps
    const Path = require('path');
    const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
    const express = require('express');
    const app = express();
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

        res.status(200).send('Save');
    };

    /*
    * POST Handler for /execute/ route of Activity.
    */
    exports.execute = function (req, res) {
        // example on how to decode JWT
        JWT(req.body, process.env.jwtSecret, (err, decoded) => {

            if (err) {
                console.error(err);
                return res.status(401).end();
            }

            if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
                var decodedArgs = decoded.inArguments[0];
            }
            });
        };
    /*
    * POST Handler for /publish/ route of Activity.
    */
    exports.publish = function (req, res) {
        res.status(200).send();
    };

    /*
    * POST Handler for /validate/ route of Activity.
    */
    exports.validate = function (req, res) {
        res.status(200).send('Validate');
    };

    exports.stop = function(req, res) {
        console.log('stop');
        res.status(200).send('Stop');

    }