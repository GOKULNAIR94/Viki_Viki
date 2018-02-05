module.exports = function(req, res, callback) {
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var http = require("https");

    var loginEncoded = "",
        qString = "";
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;
    var qString = "";

    switch (true) {
        case (intentName == "KIR_Partners"):
            {


                qString = "/salesApi/resources/latest/partners?onlyData=true";
                Query(qString, loginEncoded, req, res, function(result) {
                    if (result.items.length <= 0) {
                        speech = "No records found";
                    } else {
                        for (var i = 0; i < result.items.length; i++) {
                            speech = speech + " " + (i + 1) + ". " + result.items[i].OrganizationName + ".\n";
                            suggests.push({
                                "title": result.items[i].OrganizationName
                            })

                        }
                        speech = speech + "Select Partner to get list of associated Opportunities: ";
                    }
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });

                });
                break;
            }

        case (intentName == "KIR_Partners_opty"):
            {

                var partnerName = req.body.result.contexts[0].parameters["partnerName.original"];
                qString = "/salesApi/resources/latest/opportunities?onlyData=true&q=PrimaryPartnerOrgPartyName=" + encodeURIComponent(partnerName);

                Query(qString, loginEncoded, req, res, function(result) {
                    if (result.items.length <= 0) {
                        speech = "No records found";
                    } else {
                        for (var i = 0; i < result.items.length; i++) {
                            speech = speech + " " + (i + 1) + ". " + result.items[i].Name + ".\n";
                            suggests.push({
                                "title": result.items[i].Name
                            })

                        }
                        speech = speech + "Select Opportunities for Quote: ";
                    }
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;

            }

        case (intentName == "KIR_Partners_opty_quote"):
            {

                var optyName = req.body.result.contexts[0].parameters["optyName.original"];
                qString = "/salesApi/resources/latest/Quote_c?q=OpportunityName_c=" + encodeURIComponent(optyName);

                Query(qString, loginEncoded, req, res, function(result) {
                    if (result.items.length <= 0) {
                        speech = "No records found";
                    } else {
                        for (var i = 0; i < result.items.length; i++) {
                            speech = speech + " " + (i + 1) + ". " + result.items[i].RecordName + ", \n Amount : " + result.items[i].Amount_c + ".\n";
                            suggests.push({
                                "title": result.items[i].RecordName
                            })

                        }
                        speech = speech + "Select Quote for more details: ";
                    }
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });
                });
                break;

            }

        case (intentName == "KIR_Partners_opty_quote_details"):
            {

                var quoteName = req.body.result.contexts[0].parameters["quoteName.original"];
                qString = "/salesApi/resources/latest/Quote_c?q=RecordName=" + quoteName;

                Query(qString, loginEncoded, req, res, function(result) {
                    if (result.items.length <= 0) {
                        speech = "No records found";
                    } else {
                        speech = speech + "Name: " + result.items[0].RecordName + ", \nAmount : " + result.items[0].Amount_c + ",\nAccount: " + result.items[0].Account_c + ",\nContact : " + result.items[0].Contact_c + ".\n";

                        suggests = [{
                            "title": "Send me email"
                        },{
                            "title": "Generate Order"
                        }];
                        contextOut = [{
                            "name": "quoteid",
                            "lifespan": 5,
                            "parameters": {
                                "quoteId": result.items[0].Id
                            }
                        }];
                    }
                    returnJson = {
                        speech: speech,
                        displayText: speech,
                        contextOut : contextOut,
                        data : {
                            google: {
                                'expectUserResponse': true,
                                'isSsml': false,
                                'noInputPrompts': [],
                                'richResponse': {
                                    'items': [{
                                            'simpleResponse': {
                                                'textToSpeech': speech,
                                                'displayText': speech
                                            }
                                        },
                                        {
                                            'basicCard': {
                                                'title': '',
                                                "image": {
                                                    "url": "",
                                                    "accessibilityText": ""
                                                },
                                                'buttons': [{
                                                    'title': "Here's the link to the Quote report:\n",
                                                    'openUrlAction': {
                                                        'url': "https://acs.bi.ap2.oraclecloud.com/analytics/saw.dll?Go&path=%2Fshared%2FCustom%2FKirloskar_Demo%2FOrder%20Report&Options=rmf&Action=Navigate&P0=1&P1=eq&P2=Quote_c.RecordName&P3=" + result.items[0].RecordName;
                                                    }
                                                }]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    };
                    res.json(returnJson);
                });
                break;

            }
        case (intentName == "KIR_Partners_opty_quote_details_convert"):
            {


                var quoteId = ""; //req.body.result.contexts[3].parameters["quoteId"];
                var array = req.body.result.contexts;

                for (var key in array) {
                    console.log("**************************\narray " + key + " : " + JSON.stringify(array[key]));
                    if (array[key].name == "quoteid") {
                        quoteId = array[key].parameters["quoteId"];
                        console.log("quoteId : " + quoteId);
                        break;
                    }
                }

                console.log("quoteId : " + quoteId);
                //console.log("**************************\nReq : " + JSON.stringify(req.body) + "\n**************");

                var options = {
                    "method": "POST",
                    "hostname": "acs.crm.ap2.oraclecloud.com",
                    "port": null,
                    "path": "/salesApi/resources/latest/Quote_c/" + quoteId,
                    "headers": {
                        "content-type": "application/vnd.oracle.adf.action+json",
                        "authorization": "Basic TG50MDAxOmxudExOVDJLMTZfMQ=="
                    }
                };

                var reqHttp = http.request(options, function(resHttp) {
                    var chunks = [];

                    resHttp.on("data", function(chunk) {
                        chunks.push(chunk);
                    });

                    resHttp.on("end", function() {

                        console.log(resHttp.statusCode);

                        if (resHttp.statusCode == 200 || resHttp.statusCode == 201) {
                            speech = "Order generated";

                        } else
                            speech = "Error occured";

                        suggests = [];

                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });

                    });
                });
                reqHttp.write("{\n\t\"name\" : \"CreateOrder\"\n}");
                reqHttp.end();
                break;

            }

    }
}