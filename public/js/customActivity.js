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
    let mapLabelValue = new Map();
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
                mapLabelValue.set(data['schema'][i].key.split('.')[2],data['schema'][i].key);           
            }
            
            console.log(mapLabelValue);
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
        let variable1 = document.getElementById("variable1").value
        let variable2 = document.getElementById("variable2").value
        let variable3 = document.getElementById("variable3").value
        let variable4 = document.getElementById("variable4").value
        let variable5 = document.getElementById("variable5").value
        if(variable1 != ""){
            console.log('paso', mapLabelValue.get(variable1));
            message.replace('%%'+ variable1 + '%%', mapLabelValue.get(variable1))
        }
        if(variable2 != ""){
            message.replace('%%'+ variable2 + '%%', mapLabelValue.get(variable2))
        }
        if(variable3 != ""){
            message.replace('%%'+ variable3 + '%%', mapLabelValue.get(variable3))
        }
        if(variable4 != ""){
            message.replace('%%'+ variable4 + '%%', mapLabelValue.get(variable4))
        }
        if(variable5 != ""){
            message.replace('%%'+ variable5 + '%%', mapLabelValue.get(variable5))
        }
        console.log(message)
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "phone": '{{' + phone + '}}',
            "message": message
        }];          
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);      
    }

});