module.exports = function(req, resp) {
    var https = require('https');
    var fs = require('fs');
    var jsonQuery = require('json-query');

    var content;
    var speech = "";
    var intentName = req.body.result.metadata.intentName;

    var Name = "";
    var attrib = "";
    var HireTermOG = "";
    var attribOG = "";
    var countFlag = 0;

    var filePath = "";
    var query = "";
    var HeadCountQuery = "";
    var os = require('os');
    var qPriotity;
    var varAuth = 'Basic cHBhdGthcjpsbnRMTlQxMjM0';
    
    if ( intentName == "ADS_SNIncidents_list") {
        
        qPriotity = req.body.result.parameters['ADS_RN_Priority'];
        console.log("qPriotity : " + qPriotity);
        var qPath ="";
        if( qPriotity == "open"){
            qPath = "/services/rest/connect/latest/incidents?fields=subject&q=statusWithType.status.lookupName='Unresolved'";
        }
        else{
            if( qPriotity == "closed"){
                qPath = "/services/rest/connect/latest/incidents?fields=subject&q=statusWithType.status.lookupName='Solved'";
            }
            else{
                qPath = "/services/rest/connect/latest/incidents?fields=subject&q=customFields.c.priority.lookupName='" + encodeURIComponent(qPriotity) + "'%20AND%20statusWithType.status.lookupName='Unresolved'";
            }
        }
        console.log("List intentName : " + intentName);
        console.log("qPath : " + qPath);
        
        Query( qString, req, res, function( output ){
            for(var i = 0; i < output.items.length; i++){
                speech = speech + "Incident " + output.items[i].lookupName + ": " + output.items[i].subject + ". " + os.EOL;
            }
            resp.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            });
        });
//        var options = {
//            host: 'ntinfotech--tst.custhelp.com',
//            path: qPath,
//            headers: {
//                'Authorization': varAuth
//            }
//        };
//        
//        var output;
//        var r = https.get(options, function(resp) {
//            var body = "";
//
//            resp.on('data', function(data) {
//                body += data;
//            });
//            resp.on('end', function() {
//                console.log("Body : " + body);
//                output = JSON.parse(body);
//                
//                for(var i = 0; i < output.items.length; i++){
//                    speech = speech + "Incident " + output.items[i].lookupName + ": " + output.items[i].subject + ". " + os.EOL;
//                }
//                
//                
//                return resp.json({
//                    speech: speech,
//                    displayText: speech,
//                    //source: 'webhook-OSC-oppty'
//                });
//                
//                
//                
////                if ( incSubject != null && incSubject != "")
////                    speech = speech + "Subject : " + incSubject + "." + os.EOL;
////
////                if ( incStatus != null && incStatus != "")
////                    speech = speech + "Status : " + incStatus + "." + os.EOL;
////
////                if ( incPrior != null && incPrior != "")
////                    speech = speech + "Priority : " + incPrior + "." + os.EOL;
////
////                if ( incDesc != null && incDesc != "")
////                    speech = speech + "Notes : " + incDesc + "." + os.EOL;
////
////                return resp.json({
////                    speech: speech,
////                    displayText: speech,
////                    //source: 'webhook-OSC-oppty'
////                });
//
//            })
//        }).on('error', function(e) {
//            console.error(e);
//        });
        
    }


    if (intentName == "ADS_SNIncident" || intentName == "ADS_SNIncidents_list - custom") {
        //attrib = req.body.result.parameters['ADS_attrib'];

        number = req.body.result.parameters['Number'];
        
        Query( qString, req, res, function( result ){
            if( result.items.length > 0 ){
                qString = result.items[0].id;
                Query( qString, req, res, function( output ){
                    var incDesc = output.customFields.c.description;
                    var incPrior = output.customFields.c.priority.lookupName;
                    var incStatus = output.statusWithType.status.lookupName;
                    var incSubject = output.subject;
                    
                    if ( incSubject != null && incSubject != "")
                        speech = speech + "Subject : " + incSubject + "." + os.EOL;

                    if ( incStatus != null && incStatus != "")
                        speech = speech + "Status : " + incStatus + "." + os.EOL;

                    if ( incPrior != null && incPrior != "")
                        speech = speech + "Priority : " + incPrior + "." + os.EOL;

                    if ( incDesc != null && incDesc != "")
                        speech = speech + "Notes : " + incDesc + "." + os.EOL;
                    
                    resp.json({
                        speech: speech,
                        displayText: speech,
                        //source: 'webhook-OSC-oppty'
                    });
                });
            }
            else{
                //console.log( "combObj 2: " + JSON.stringify(combObj) );
                speech = "No records found! Please check the Incident Number and try again!"
                resp.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                });
            }

        });
//        var options = {
//            host: 'ntinfotech--tst.custhelp.com',
//            path: '/services/rest/connect/latest/incidents/' + number,
//            headers: {
//                'Authorization': varAuth
//            }
//        };
//        console.log("Here intentName : " + intentName);
//        var output;
//        var r = https.get(options, function(res) {
//            var body = "";
//
//            res.on('data', function(data) {
//                body += data;
//            });
//            res.on('end', function() {
//                console.log("Body : " + body);
//                output = JSON.parse(body);
//                
//                
//                var incDesc = output.customFields.c.description;
//                var incPrior = output.customFields.c.priority.lookupName;
//                var incStatus = output.statusWithType.status.lookupName;
//                var incSubject = output.subject;
                
                
                
                if ( incSubject != null && incSubject != "")
                    speech = speech + "Subject : " + incSubject + "." + os.EOL;

                if ( incStatus != null && incStatus != "")
                    speech = speech + "Status : " + incStatus + "." + os.EOL;

                if ( incPrior != null && incPrior != "")
                    speech = speech + "Priority : " + incPrior + "." + os.EOL;

                if ( incDesc != null && incDesc != "")
                    speech = speech + "Notes : " + incDesc + "." + os.EOL;

//                return resp.json({
//                    speech: speech,
//                    displayText: speech,
//                    //source: 'webhook-OSC-oppty'
//                });
//
//            })
//        }).on('error', function(e) {
//            console.error(e);
//        });

        

    }
}