module.exports = function(req, res, callback) {
    
    var toTitleCase = require("titlecase");
    
    var Query = require("./query");
    var Update = require("./update");
    var SendResponse = require("./sendResponse");
    
    var SendEmail = require("./sendEmail");
    var createTicket = require("./createTicket");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    
    var intentName = req.body.result.metadata.intentName;

    var priority = req.body.result.parameters['ADS_RN_Priority'];
    var description = req.body.result.parameters['description'];
    var respon = req.body.result.parameters['PSFTRespName'];
    
    var shortDesc = "Required access to PeopleSoft responsibility " + respon;
    
    speech = "Sure. I have put in a Service Now ticket for a support professional to help you with your PeopleSoft Access request. Here is your ticket number: ";
    var ticket = {};
    
    ticket = {"caller_id":"Kaaman Agarwal","priority":"2","severity":"3","description": description, "short_description" : shortDesc};
    
//    ticket = {
//        "primaryContact":
//        {
//        "id": 60
//        },
//        "channel": {
//            "id": 8
//        },
//
//        "assignedTo": {
//            "staffGroup": {
//                "lookupName": "Admin"
//            }
//        },
//        "customFields": {
//            "c": {
//                "description": description,
//                "priority": {
//                    "lookupName": priority
//                }
//            }
//        },
//
//
//        "statusWithType": {
//            "status": {
//                "lookupName": "Unresolved"
//            }
//        },
//        "subject": subject
//    };
    createTicket( ticket, function( tId ) {
        speech = speech + tId + ".";
        console.log("Ticket created : " + speech);
        SendResponse(speech, suggests, contextOut, req, res, function() {
            console.log("Finished!");
        });
    });
}
