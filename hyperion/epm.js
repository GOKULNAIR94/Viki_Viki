module.exports = function(req, res, callback) {
    var SendResponse = require("./sendResponse");
    var Query = require("./query");
    var Get = require("./get");
    var http = require("https");
    var toTitleCase = require("titlecase");

    var qString = "";
    var speech = "";
    var suggests = [];
    var contextOut = [];
    var intentName = req.body.result.metadata.intentName;
    var qString = "";
    
    var body = "";
    console.log("Result : " + JSON.stringify(req.body));


    switch (true) {
        case (intentName == "EPM_MDXQuery"):
            {
                qString = "/HyperionPlanning/rest/11.1.2.4/applications/vision/dataexport/plantypes/Plan1";
                
//                body = "mdxQuery=SELECT {[Period].[" + req.body.result.parameters.Period + "]} ON COLUMNS, {[Account].[" + req.body.result.parameters.epm_account + "]} ON ROWS FROM Vision.Plan1 WHERE ([Year].[" + req.body.result.parameters.epm_year + "],[Scenario].[" + req.body.result.parameters.epm_scenario + "],[Version].[" + req.body.result.parameters.epm_version + "],[Entity].[" + "403" + "])";
                body = "mdxQuery=SELECT {[Period].[" + req.body.result.parameters.Period + "]} ON COLUMNS, {[Account].[" + req.body.result.parameters.epm_account + "]} ON ROWS FROM Vision.Plan1 WHERE ([Year].[" + req.body.result.parameters.epm_year + "],[Scenario].[" + req.body.result.parameters.epm_scenario + "],[Version].[" + req.body.result.parameters.epm_version + "],[Entity].[" + "403" + "],[Product].[" + "No Product" + "])";
                //    body = "mdxQuery=SELECT {[Period].[BegBalance]} ON COLUMNS, {[Account].[ASP]} ON ROWS FROM Vision.Plan1 WHERE ([Year].[FY17],[Scenario].[Current],[Version].[Working],[Entity].[000],[Product].[P_000])";
                
                Query( qString, body, req, res, function(result) {
                    try{
//                      speech = "The " + req.body.result.contexts[0].parameters["epm_account.original"]  + " for " + req.body.result.contexts[0].parameters["Period.original"]  + " " + req.body.result.contexts[0].parameters["epm_year.original"] + " is $" + parseFloat(result.rows[0].data[0]).toFixed(2);

                        


                        speech = "The " + req.body.result.contexts[0].parameters["epm_account.original"]  + " for " + req.body.result.contexts[0].parameters["Period.original"]  + " " + req.body.result.contexts[0].parameters["epm_year.original"] + " is $" + parseFloat(result.rows[0].data[0]).toFixed(2);
                        speech = "The " + toTitleCase(req.body.result.contexts[0].parameters["epm_account.original"]) + " – " + req.body.result.parameters.epm_account + " (Version: " + req.body.result.parameters.epm_version + ", Scenario: " + req.body.result.parameters.epm_scenario + ") for " + toTitleCase(req.body.result.contexts[0].parameters["Period.original"]) + " " + req.body.result.contexts[0].parameters["epm_year.original"] + " is $" + parseFloat(parseFloat(result.rows[0].data[0]).toFixed(2)).toLocaleString() + ". \nIs there anything else I can help you with?"
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                  }
                  catch(e){
                      res.json({
                          speech: "Error: " + e ,
                            displayText: "Error: " + e 
                        
                    });
                  }
                    

                });
                break;
            }
            
        case (intentName == "EPM_Jobs"):
            {
                qString = "/HyperionPlanning/rest/11.1.2.4/applications/Vision/jobs";
                body = "jobType=CUBE_REFRESH&jobName=RefreshCube";
                Query( qString, body, req, res, function(result) {
                    try{
                      speech = "Job Status has been updated to " + result.descriptiveStatus + ".\nJob Id: " + result.jobId + "";
                        contextOut = [{
                                "name": "jobid",
                                "lifespan": 1,
                                "parameters": {
                                    "jobid": result.jobId
                                }
                            }];
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                  }
                  catch(e){
                      res.json({
                        message : "Error: " + e 
                    });
                  }
                    

                });
                break;
            }
            
        case (intentName == "EPM_Jobs - custom" || intentName == "EPM_JobStatus"  ):
            {
                var jobId = ""; 
                if( intentName == "EPM_Jobs - custom" ){
                    var array = req.body.result.contexts;
                           
                    for( var key in array ){
                        console.log("**************************\narray "+ key +" : " + JSON.stringify(array[key]));
                        if( array[key].name == "jobid"){
                            jobId = array[key].parameters["jobid"];
                            break;
                        } 
                    }
                }
                else
                    if(intentName == "EPM_JobStatus"){
                        jobId = req.body.result.parameters.jobid;
                    }
                
                console.log("jobid : " + jobId);
                qString = "/HyperionPlanning/rest/11.1.2.4/applications/Vision/jobs/" + jobId;
                body = "";
                Get( qString, body, req, res, function(result) {
                    try{
                      speech = "Status of job ( Id: " + jobId + " ) is " + result.descriptiveStatus + ".";
                        SendResponse(speech, suggests, contextOut, req, res, function() {
                            console.log("Finished!");
                        });
                  }
                  catch(e){
                      res.json({
                        message : "Error: " + e 
                    });
                  }
                    

                });
                break;
            }

    }
}