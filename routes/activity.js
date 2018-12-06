    'use strict';
    var util = require('util');

    // Deps
    const Path = require('path');
    const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
    const express = require('express');
    const app = express();
    const request = require('request');
   
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
        console.log('execute')
        JWT(req.body, process.env.jwtSecret, (err, decoded) => {

            if (err) {
                console.error(err);
                return res.status(401).end();
            }

            if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
                var decodedArgs = decoded.inArguments[0];
                console.log(decodedArgs.phone)
                console.log(decodedArgs.message);
                console.log(decodedArgs.name);
                console.log(decodedArgs.lastName);
                console.log(decodedArgs.preference);

                var text = decodedArgs.message;
                console.log(text);
                if(text.includes('%%Nombre%%')){
                    text = text.replace('%%Nombre%%', decodedArgs.name)
                }
    
                if(text.includes('%%Apellido%%')){
                    text = text.replace('%%Apellido%%', decodedArgs.lastName)
                }
    
                if(text.includes('%%Preferencia%%')){
                    text = text.replace('%%Preferencia%%', decodedArgs.preference)
                }
                let sendGroup = {
                    url: 'http://panel.apiwha.com/send_message.php?apikey=UKKEOBPZ0JN3SSVZ0ZRF&number='+ decodedArgs.phone+'&text='
                            + text + '',
                    method: 'POST',
                } 
                request(sendGroup, function (error, response, body) {
                    console.log(body);
                    console.log(error);
                    res.status(200).end();
                })    
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