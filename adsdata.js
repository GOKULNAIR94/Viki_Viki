module.exports = function(req, res) {

        var fs = require('fs');
        var jsonQuery = require('json-query');

        var content;
        var speech;
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
            var responseObject;
            var r = https.get(options, function(res) {
                var body = "";

                res.on('data', function(data) {
                    body += data;
                });
                res.on('end', function() {
                    console.log(body);
                    responseObject = JSON.parse(body);
                    //response.json(responseObject);
                    //console.log(responseObject);

                })
            }).on('error', function(e) {
                console.error(e);
            });

            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            });

        }