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
            
            // save schema
            schemas = data['schema'];
            console.log(schemas);
            for(var i = 0; i < data['schema'].length; i++) {
                var split = data['schema'][i].key.split('.');
                console.log(split)
                console.log(split[2])
                if(split[2] === 'CampaignMember:Common:MobilePhone'){
                    phone = split[0] + '.' +  split[2];
               } else if(split[2] === 'firstName'){
                    name = data['schema'][i].key;

               } else if(split[2] === 'LastName'){
                    lastName = data['schema'][i].key;

                } else if(split[2] === 'Preference'){
                    preference = data['schema'][i].key;
                } 
            }

            console.log(name)
            console.log(lastName)
            console.log(preference)
            console.log(phone)
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
            "name": '{{' + name + '}}',
            "lastName":'{{' + lastName + '}}',
            "preference":'{{' + preference + '}}'
        }];          
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);      
    }

});