define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';
    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};    
    var schemas = [];  
    let variableActivity = [];
    
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
                variableActivity.push(data['schema'][i].key)           
            }
            
            console.log(variableActivity)
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
        let variable1 = document.getElementById("variable1").value
        let variable2 = document.getElementById("variable2").value
        let variable3 = document.getElementById("variable3").value
        let variable4 = document.getElementById("variable4").value
        let variable5 = document.getElementById("variable5").value
        let variableMC1;
        let variableMC2;
        let variableMC3;
        let variableMC4;
        let variableMC5;
        for(var i = 0; i < variableActivity.length; i++){
            if(variable[i].includes(variable1)){
                variableMC1 = 'hola {{'+ variable[i] +'}}'
            }
            if(variable[i].includes(variable2)){
                variableMC2 = '{{'+ variable[i] +'}}'
            }
            if(variable[i].includes(variable3)){
                variableMC3 = '{{'+ variable[i] +'}}'
            }
            if(variable[i].includes(variable4)){
                variableMC4 = '{{'+ variable[i] +'}}'
            }
            if(variable[i].includes(variable5)){
                variableMC5 = '{{'+ variable[i] +'}}'
            }

        }
     
        var message = $("#textarea").val()
        console.log(message)
        console.log(phone)   
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "phone": '{{' + phone + '}}',
            "message": message ,
            "variable1":variableMC1,
            "variable2":variableMC2,
            "variable3":variableMC3,
            "variable4":variableMC4,
            "variable5":variableMC5,
        }];          
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);      
    }

});