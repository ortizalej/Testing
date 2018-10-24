    'use strict';
    var util = require('util');

    // Deps
    const Path = require('path');
    const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
    var util = require('util');
    var http = require('https');
    const express = require('express');
    const app = express();
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    const MailUpClient = require('./mailupclient');
    var request = require('request');
    var numbers = [];
    var limit = 0;
    var jsonFinall = '[';
    var CLIENT_ID = process.env.CLIENT_ID;
    var CLIENT_SECRET = process.env.CLIENT_SECRET;
    var CALLBACK_URI = process.env.CALLBACK_URI; 
    var mailingUp = new MailUpClient(CLIENT_ID, CLIENT_SECRET, CALLBACK_URI);

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
        limit ++;
        var json = '';
        var jsonStringSubHeader = '';
        var jsonStringSub = '';
        var jsonStringSubFooter = ''; 
        // example on how to decode JWT
        JWT(req.body, process.env.jwtSecret, (err, decoded) => {

            if (err) {
                console.error(err);
                return res.status(401).end();
            }

            if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
                var decodedArgs = decoded.inArguments[0];
                console.log(limit);
                console.log(decodedArgs.limit);
                if(Number(limit) <= Number(decodedArgs.limit)) {
                    if(decodedArgs.phone === null){
                        console.log('Sin numero');
                        res.status(400).end();
                    }
                    if(numbers.includes(decodedArgs.phone) === false) {
                    
                        //Build Json
                        if(limit != 1) {
                            jsonStringSubHeader = '{"Email":"","Fields":[';
                        } else {
                            jsonStringSubHeader = '[{"Email":"","Fields":[';
                        }      

                        if(decodedArgs.field1MU != '') {
                            var index = decodedArgs.referenceFields.findIndex(element => element === decodedArgs.field1MU);
                            jsonStringSub += '{"Description":"' + decodedArgs.field1MU + '",' + 
                                            '"Id":' + index + ',' +
                                            '"Value":"' + decodedArgs.field1SF + '"}';
                            if(decodedArgs.field2MU != ''|| decodedArgs.field3MU != '' 
                            || decodedArgs.field4MU != ''|| decodedArgs.field5MU != '') {
                                    jsonStringSub += ',';   
                            }  
                        }
                        if(decodedArgs.field2MU != ''){
                            var index = decodedArgs.referenceFields.findIndex(element => element === decodedArgs.field2MU);
                            jsonStringSub += '{"Description":"' + decodedArgs.field2MU + '",' + 
                                            '"Id":' + index + ',' +
                                            '"Value":"' + decodedArgs.field2SF + '"}';
                            if(decodedArgs.field3MU != '' || decodedArgs.field4MU != ''|| decodedArgs.field5MU != '') {
                                jsonStringSub += ',';   
                            }                                    
                        }

                        if(decodedArgs.field3MU != ''){
                            var index = decodedArgs.referenceFields.findIndex(element => element === decodedArgs.field3MU);
                            jsonStringSub += '{"Description":"' + decodedArgs.field3MU + '",' + 
                                            '"Id":' + index + ',' +
                                            '"Value":"' + decodedArgs.field3SF + '"}';
                            if(decodedArgs.field4MU != ''|| decodedArgs.field5MU != '') {
                                jsonStringSub += ',';   
                            }                                    
                        }

                        if(decodedArgs.field4MU != ''){
                            var index = decodedArgs.referenceFields.findIndex(element => element === decodedArgs.field4MU);
                            jsonStringSub += '{"Description":"' + decodedArgs.field4MU + '",' + 
                                            '"Id":' + index + ',' +
                                            '"Value":"' + decodedArgs.field4SF + '"}';
                            if(decodedArgs.field5MU != '') {
                                jsonStringSub += ',';   
                            }                                    
                        }


                        if(decodedArgs.field5MU != ''){
                            var index = decodedArgs.referenceFields.findIndex(element => element === decodedArgs.field5MU);
                            jsonStringSub += '{"Description":"' + decodedArgs.field5MU + '",' + 
                                            '"Id":' + index + ',' +
                                            '"Value":"' + decodedArgs.field5SF + '"}';
                                            
                        }       
                        console.log(decodedArgs.limit === limit);
                        if(Number(decodedArgs.limit) === limit) {
                            jsonStringSubFooter = '],' + 
                            '"MobileNumber":"' + decodedArgs.phone + '",' + 
                            '"MobilePrefix":"0054",' +    
                            '"Name": null}]' ;

                        } else {
                            jsonStringSubFooter = '],' + 
                            '"MobileNumber":"' + decodedArgs.phone + '",' + 
                            '"MobilePrefix":"0054",' +    
                            '"Name": null},' ;                  
                        }             
                    } else if(Number(limit) === Number(decodedArgs.limit)) {
                        res.status(400).end();
                    }
                    json += jsonStringSubHeader + jsonStringSub + jsonStringSubFooter;

                    if(decodedArgs.limit != limit) {
                        jsonFinall += json;                                   
                        res.status(200).end();
                    } else {
                        mailingUp.logOnWithUsernamePassword(process.env.User,process.env.Pass,

                            function(data) {
                                jsonFinall += json;
                                console.log(jsonFinall);                                  
                                var headers = {
                                    "Authorization": "Bearer " + data,
                                    "Content-type": "application/json"
                                }
                                
                                var options = {
                                    url: 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/Group/' + decodedArgs.group + '/Recipients',
                                    method: 'POST',
                                    headers: headers,
                                    json: JSON.parse(jsonFinall)
                                }

                                request(options, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        console.log(limit);
                                        console.log(decodedArgs.limit);
                                        console.log(body);
                                        if(Number(limit) === Number(decodedArgs.limit)) {
                                            var headersEmail = {
                                                "Authorization": "Bearer " + data,
                                                "Content-type": "application/json"
                                            } 
                                            var optionsImportMail = {
                                                url: 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/Email/Send',
                                                method: 'POST',
                                                headers: headersEmail,
                                                json : {"Email":"" + decodedArgs.trackMail + "","idMessage":9221}
                                            }
                                            request(optionsImportMail, function (error, response, body) {
                                                if (!error && response.statusCode == 200) {
                                                    setTimeout(function(){
                                                        var headersSend = {
                                                            "Authorization": "Bearer " + data,
                                                            "Content-type": "application/json"
                                                        }
                                                        var optionsSend = {
                                                            url: 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/Sms/Group/'+decodedArgs.group +'/Message/' + decodedArgs.messageId + '/Send',
                                                            method: 'POST',
                                                            headers: headersSend,
                                                            body : null
                                                        }
                                                        request(optionsSend, function (error, response, body) {
                                                            if (!error && response.statusCode == 200) {
                                                                var optionsSendMail = {
                                                                    url: 'https://services.mailup.com/API/v1.1/Rest/ConsoleService.svc/Console/Email/Send',
                                                                    method: 'POST',
                                                                    headers: headersEmail,
                                                                    json : {"Email":"" + decodedArgs.trackMail + "","idMessage":9222}
                                                                }
                                                                request(optionsSendMail, function (error, response, body) {
                                                                    if (!error && response.statusCode == 200) {
                                                                        res.status(200).end();
                                                                    } else{
                                                                        res.status(400).end();
                                                                    }
                                                                })                                                            
                                                            } else{
                                                                res.status(400).end();   
                                                            }
                                                        })                               
                                                    }, 480000);                                                  
                                                } else{
                                                    res.status(400).end();   
                                                }
                                            })                                                                                             
                                
                                        } else {
                                            res.status(200).end();

                                        }
                                    } else {
                                        res.status(400).end(); 
                                    }
                                })
                            }
                        );
                    }                    
                    }
                } else {
                    console.error('inArguments invalid.');
                    return res.status(400).end();
                }
            });
        };
    /*
    * POST Handler for /publish/ route of Activity.
    */
    exports.publish = function (req, res) {
        limit = 0;
        jsonFinall = '';
        res.status(200).send();
    };

    /*
    * POST Handler for /validate/ route of Activity.
    */
    exports.validate = function (req, res) {
        // Data from the req and put it in an array accessible to the main app.
        console.log( req.body );
        console.log('validate');
        res.status(200).send('Validate');
    };

    exports.stop = function(req, res) {
        console.log('stop');
        res.status(200).send('Stop');

    }