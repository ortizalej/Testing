define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';
    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var phone;
    var name;
    var lastName;
    var preference;        
    var schemas = [];  
    $(window).ready(onRender);
    
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'

        connection.trigger('requestSchema');
        connection.on('requestedSchema', function (data) {
            phone = split[0] + '.' +  split[1] +'.\"' + split[2] + '\"';
            let variables = document.getElementById("variable").split(',');
            let variableActivity = [];
            // save schema
            schemas = data['schema'];
            console.log(schemas);
            for(var i = 0; i < data['schema'].length; i++) {
                var split = data['schema'][i].key.split('.');
                console.log(split)
                console.log(split[2])  
                let variable = variables.find(function(element){
                    return element == split[2]
                })
                console.log(variable)
                variableActivity.push( split[0] + '.' +  split[1] +'.\"' + split[2] + '\"')           
            }
            connection.trigger('ready');

            connection.trigger('requestTokens');
            connection.trigger('requestEndpoints');            
         });

    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
               console.log(inArguments); 
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true,
        });
    }
    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var message = $("#textarea").val()
        console.log(message)
        console.log(phone)   
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "phone": '{{' + phone + '}}',
            "message": message ,
            "variables": variableActivity
        }];          
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);      
    }

});