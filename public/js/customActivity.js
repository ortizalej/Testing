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
    var messageId = '';
    var option = '';        
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
                option += '<option value="'+ split[2] + '">' + split[2] + '</option>';   
               if(data['schema'][i].type === 'Phone'){
                    phone = data['schema'][i].key;
                    console.log(phone);
               } 
            }
            $('#var1').append(option);
            $('#var2').append(option);
            $('#var3').append(option);
            $('#var4').append(option);
            $('#var5').append(option);
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
        var options = [];
        var varSF1 = '';
        var varSF2 = '';
        var varSF3 = '';
        var varSF4 = '';
        var varSF5 = '';
        var canSend = $("#canSend").val();
        var limit = $("#limit").val();
        var trackMail = $("#trackMail").val();
        var group = document.getElementById("group").innerHTML;
        messageId = document.getElementById("messageId").innerHTML;
        console.log(messageId);
        $("#var1Mail option").each(function(){
            options.push(this.value);
        });
        console.log(schemas);
        for(var i = 0; i < schemas.length; i++) {
            var split = schemas[i].key.split('.');
            if($('#var1 option:selected').val() === split[2]) {
                varSF1 = schemas[i].key;
            }
            if($('#var2 option:selected').val() === split[2]) {
                varSF2 = schemas[i].key;
            }
            if($('#var3 option:selected').val() === split[2]) {
                varSF3 = schemas[i].key;
            }
            if($('#var4 option:selected').val() === split[2]) {
                varSF4 = schemas[i].key;
            }
            if($('#var5 option:selected').val() === split[2]) {
                varSF5 = schemas[i].key;
            }                                    
            
        }            
         
            if(canSend === 'true') {
                payload['arguments'].execute.inArguments = [{
                    "tokens": authTokens,
                    "messageId" : messageId,
                    "phone": '{{' + phone + '}}',
                    "limit" : limit,
                    "field1SF": '{{' + varSF1 + '}}',
                    "field2SF": '{{' + varSF2 + '}}',
                    "field3SF": '{{' + varSF3 + '}}',
                    "field4SF": '{{' + varSF4 + '}}',
                    "field5SF": '{{' + varSF5 + '}}',
                    "field1MU": $('#var1Mail option:selected').val(),
                    "field2MU": $('#var2Mail option:selected').val(),
                    "field3MU": $('#var3Mail option:selected').val(),
                    "field4MU": $('#var4Mail option:selected').val(),
                    "field5MU": $('#var5Mail option:selected').val(),
                    "referenceFields":options,
                    "group": group,
                    "trackMail": trackMail
                }];          
                payload['metaData'].isConfigured = true;
                connection.trigger('updateActivity', payload);      

            } else if(canSend === 'false') {
                alert('Presione el boton de Guardar antes de continuar');
                onRender();     
            } 
    }

});