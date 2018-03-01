'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var http = require('https');
var fs = require('fs');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var jsonQuery = require('json-query');


var DCPData = require("./dcpdata");
var KIR = require("./osc/kir");
var BIP = require("./bip/bip");
var EPM = require("./hyperion/epm");
var HCM = require("./hcm/hcm");

var ADSData = require("./adsdata");
var SendEmail = require("./sendEmail");
var sendAdhocEmail = require("./sendAdhocEmail");
var createTicket = require("./createTicket");

restService.post('/inputmsg', function(req, res) {

    var Market = '';
    var Period = '';
    var dateperiod = '';
    var Month = '';

    var speech = '';
    var query = '';

    //req =  JSON.parse(content);
    //console.log( "Req : " + JSON.stringify(req.body) );

    var intentName = req.body.result.metadata.intentName;

    console.log("intentName THIS : " + intentName);
    var content;
    try {
        if (intentName == 'Budget') {
            Market = req.body.result.parameters.Market;
            Period = req.body.result.parameters.Period;
            dateperiod = req.body.result.parameters.dateperiod;
            Month = dateperiod.split("/")[1];


            console.log("Market : " + Market);
            console.log("Period : " + Period);
            console.log("dateperiod : " + dateperiod);
            console.log("Month : " + Month);

            content = fs.readFileSync('data.json', 'utf8');
            console.log("Content : " + content);
            content = JSON.parse(content);

            if (Market != "Global") {
                query = "Market=" + Market + " & ";
            }
            if (Period == "MTD") {
                query = query + "Month=" + Month;
                //query = query + "Period=" + Period + " & Month=" + Month;
            } else {
                var fyStartDate = "";
                var arr = Month.split("-");
                if (arr[1] >= 4) {
                    fyStartDate = arr[0] + "-0" + 4 + "-" + 1;
                } else {
                    fyStartDate = (parseInt(arr[0]) - 1) + "-0" + 4 + "-" + 1;
                }
                console.log("fyStartDate : " + fyStartDate);
                query = query + "Month >= " + fyStartDate + " & Month <= " + Month;
            }


            console.log("query : " + query);
            var output =
                jsonQuery('items[* ' + query + '][Remaining Budget]', {
                    data: content
                }).value;
            console.log("Output : " + output);
            console.log("Output Length : " + output.length);
            if (output.length == 0) {
                speech = "No records found."
            }
            if (output.length == 1) {
                console.log("Output : " + output);
                speech = "The remaining YTD Budget for Entertainment is " + output + "$. Is there anything else I can help you with?"
            }
            if (output.length > 1) {
                var sum = 0;
                for (var i = 0; i < output.length; i++) {
                    sum = sum + parseFloat(output[i]);
                }
                console.log("Sum : " + sum);
                speech = "The remaining YTD Budget for Entertainment is " + sum + "$. Is there anything else I can help you with?"
            }
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        }

        if (intentName == 'Expense') {
            Market = req.body.result.parameters.Market;
            Period = req.body.result.parameters.Period;
            dateperiod = req.body.result.parameters.dateperiod;
            Month = dateperiod.split("/")[1];

            console.log("intentName : " + intentName);
            console.log("Market : " + Market);
            console.log("Period : " + Period);
            console.log("dateperiod : " + dateperiod);
            console.log("Month : " + Month);


            content = fs.readFileSync('data.json', 'utf8');
            console.log("Content : " + content);
            content = JSON.parse(content);

            query = "Month = " + Month;

            if (Market != "Global") {
                query = query + " & Market =" + Market;
            }

            console.log("query : " + query);
            var output =
                jsonQuery('items[* ' + query + '][Expense]', {
                    data: content
                }).value;
            console.log("Output : " + output);
            console.log("Output Length : " + output.length);
            if (output.length == 0) {
                speech = "No records found."
            }
            if (output.length == 1) {
                console.log("Output : " + output);
                speech = "The Entertainment expense for " + Market + " is " + output + "$. Is there anything else I can help you with?"
            }
            if (output.length > 1) {
                var sum = 0;
                for (var i = 0; i < output.length; i++) {
                    sum = sum + parseFloat(output[i]);
                }
                console.log("Sum : " + sum);
                speech = "The Entertainment expense for " + Market + " is " + sum + "$. Is there anything else I can help you with?"
            }
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        }
        if (intentName.indexOf("DCP -") == 0) {
            DCPData(req, res, function(result) {
                console.log("EmpData Called");
            });
        }

        if (intentName.indexOf("ADS_SNIncident") == 0 ) {
            ADSData(req, res, function(result) {
                console.log("ADSData Called");
            });
        }
        if (intentName.indexOf("ADS_GLData") == 0 || intentName.indexOf("Hyperion ADS - Smart View -") == 0 || intentName == 'Hyperion - no - yes' ) {
            var subject = "";
            var priority;
            var description;
            var ticket;
            
            if( intentName == 'Hyperion - no - yes' ){
                
                priority = req.body.result.parameters['ADS_RN_Priority'];
                description = req.body.result.parameters['description'];
                
                for(var i=0; i <=3; i++){
                    var errormessage = req.body.result.contexts[i].parameters['errormessage'];
                    var appName = req.body.result.contexts[i].parameters['appName'];
                    var connType = req.body.result.contexts[i].parameters['connType'];
                    if( errormessage != null || appName != null )
                        break;
                }
                
                
                subject = "Unable to connect to smart view. Error message : " + errormessage + ". Application : " + appName + ". Connection : " + connType + ".";
                description = description + "\nError message : " + errormessage + "\nApplication : " + appName + "\nConnection : " + connType;
                
                speech = "Ok. I have documented all that we spoke in a ticket on Service now. An engineer will get in touch with you at the earliest. Anytime you need a status on this ticket please reach out to me. Here's your ticket number: ";
            }
            
            if( intentName.indexOf("ADS_GLData") == 0 ){
                console.log("ADS_GLData Called");
                var app = req.body.result.parameters['ADS_AdhocData'];
                var reportYear = req.body.result.parameters['reportYear'];
                var reportScenario = req.body.result.parameters['reportScenario'];
                
                priority = req.body.result.parameters['ADS_RN_Priority'];
                description = req.body.result.parameters['description'];  
                subject = "GL data is missing in "+ app +" for "+ reportYear +" for "+ reportScenario +" scenario";
                speech = "I have put in a ticket in servicenow for the hyperion support team to look into this. You will be notified once data been restored. Here's the ticket number for reference: Incident Id: ";
                
            }
            if( intentName.indexOf("Hyperion ADS - Smart View -") == 0 ){
                console.log("Hyperion ADS - Smart View Called");
                priority = req.body.result.parameters['ADS_RN_Priority'];
                description = req.body.result.parameters['description'];
                if( intentName == 'Hyperion ADS - Smart View - 2016 - yes' )
                    subject = "Smart View Add-In disappers in Excel 2016";
                
                if( intentName == 'Hyperion ADS - Smart View - 2013 - no - yes' )
                    subject = "Smart View Add-In disappers in Excel 2013.";
                
                speech = "Sure. I have put in a Service Now ticket for a support professional to help you with the MS Office. Here is your ticket number: ";
            } 
            
            ticket = {"caller_id":"Kaaman Agarwal","priority":"2","severity":"3","description": description, "short_description" : subject};
//            ticket = {
//                "primaryContact":
//                {
//                "id": 60
//                },
//                "channel": {
//			        "id": 8
//			    },
//
//                "assignedTo": {
//                    "staffGroup": {
//                        "lookupName": "Admin"
//                    }
//                },
//                "customFields": {
//                    "c": {
//                        "description": description,
//                        "priority": {
//                            "lookupName": priority
//                        }
//                    }
//                },
//
//
//                "statusWithType": {
//                    "status": {
//                        "lookupName": "Unresolved"
//                    }
//                },
//                "subject": subject
//            };
            createTicket( ticket, function( tId ) {
                speech = speech + tId + ".";
                console.log("Ticket created : " + speech);
                return res.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                })
            });
        
        }
        if (intentName == 'ADS_HyperionReport' || intentName == 'reporting') {
            SendEmail(req, res, function(result) {
                console.log("SendEmail Called");
            });
        }
        if (intentName == 'ADS_AdhocData') {
            sendAdhocEmail(req, res, function(result) {
                console.log("SendEmail Called");
            });
        }
        
        if (intentName.indexOf("KIR_") == 0 ){
            KIR(req, res, function(result) {
                console.log("KIR Called");
            });
        }
        
        if (intentName.indexOf("EPM_") == 0 ){
            EPM(req, res, function(result) {
                console.log("EPM Called");
            });
        }
        
        if (intentName.indexOf("BIP_") == 0 ){
            BIP(req, res, function(result) {
                console.log("BIP Called");
            });
        }
        
        if (intentName.indexOf("hcm_") == 0 ){
            HCM(req, res, function(result) {
                console.log("HCM Called");
            });
        }

    } catch (e) {
        console.log("Error : " + e);
    }

});


restService.listen((process.env.PORT || 9000), function() {
    console.log("Server up and listening");
});