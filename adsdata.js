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
    
    if ( intentName == "ADS_SNIncidents_list") {
        
        qPriotity = req.body.result.parameters['ADS_RN_Priority'];
        var qPath ="";
        if( qPriotity == "open"){
            qPath = "/services/rest/connect/latest/incidents?q=statusWithType.status.lookupName='Unresolved'";
        }
        else{
            qPath = "/services/rest/connect/latest/incidents?q=customFields.c.priority.lookupName='" + qPriotity + "'";
        }
        console.log("List intentName : " + intentName);
        console.log("qPath : " + qPath);
        console.log("qPriotity : " + qPriotity);
        
        var options = {
            host: 'ntinfotech--tst.custhelp.com',
            path: encodeURIComponent(qPath),
            headers: {
                'Authorization': 'Basic cHBhdGthcjpsbnRMTlQxMjM0'
            }
        };
        
        var output;
        var r = https.get(options, function(res) {
            var body = "";

            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                console.log("Body : " + body);
                output = JSON.parse(body);
                
                
                //var incDesc = output.customFields.c.description;
                
                
                
                
//                if ( incSubject != null && incSubject != "")
//                    speech = speech + "Subject : " + incSubject + "." + os.EOL;
//
//                if ( incStatus != null && incStatus != "")
//                    speech = speech + "Status : " + incStatus + "." + os.EOL;
//
//                if ( incPrior != null && incPrior != "")
//                    speech = speech + "Priority : " + incPrior + "." + os.EOL;
//
//                if ( incDesc != null && incDesc != "")
//                    speech = speech + "Notes : " + incDesc + "." + os.EOL;
//
//                return resp.json({
//                    speech: speech,
//                    displayText: speech,
//                    //source: 'webhook-OSC-oppty'
//                });

            })
        }).on('error', function(e) {
            console.error(e);
        });
        
    }


    if (intentName == "ADS_SNIncident" || intentName == "ADS_SNIncidents_list - custom") {
        //attrib = req.body.result.parameters['ADS_attrib'];

        number = req.body.result.parameters['Number'];
        var options = {
            host: 'ntinfotech--tst.custhelp.com',
            path: '/services/rest/connect/latest/incidents/' + number,
            headers: {
                'Authorization': 'Basic cHBhdGthcjpsbnRMTlQxMjM0'
            }
        };
        console.log("Here intentName : " + intentName);
        var output;
        var r = https.get(options, function(res) {
            var body = "";

            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                console.log("Body : " + body);
                output = JSON.parse(body);
                
                
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

                return resp.json({
                    speech: speech,
                    displayText: speech,
                    //source: 'webhook-OSC-oppty'
                });

            })
        }).on('error', function(e) {
            console.error(e);
        });

        

    }
}