module.exports = function(req, res, callback) {
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var http = require("https");

    var qString = "";
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    
    var body = "";
    body = "mdxQuery=SELECT {[Period].[" + req.body.result.parameters.period + "]} ON COLUMNS, {[Account].[" + req.body.result.parameters.account + "]} ON ROWS FROM Vision.Plan1 WHERE ([Year].[" + req.body.result.parameters.year + "],[Scenario].[" + req.body.result.parameters.scenario + "],[Version].[" + req.body.result.parameters.version + "],[Entity].[" + req.body.result.parameters.entity + "],[Product].[" + req.body.result.parameters.product + "])";
//    body = "mdxQuery=SELECT {[Period].[BegBalance]} ON COLUMNS, {[Account].[ASP]} ON ROWS FROM Vision.Plan1 WHERE ([Year].[FY17],[Scenario].[Current],[Version].[Working],[Entity].[000],[Product].[P_000])";

    switch (true) {
        case (intentName == "EPM_MDXQuery"):
            {
                qString = "/HyperionPlanning/rest/11.1.2.4/applications/vision/dataexport/plantypes/Plan1";
                Query( qString, body, req, res, function(result) {
                    speech = speech + "Thank you Viki = " + result.rows[0].data[0];
                    SendResponse(speech, suggests, contextOut, req, res, function() {
                        console.log("Finished!");
                    });

                });
                break;
            }

    }
}