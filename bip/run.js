module.exports = function ( req, resp, callback){ 
    var http = require("https");
    console.log("RUN 1");
    var soap = require('soap');
    
//    var methodName = "runReport";
    try{
        var soap = require('soap');
        var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/v2/ReportService?wsdl';
        var args = { Authorization: "Basic TE5UMDAxOmxudExOVDJLMTZfMQ=="};
        soap.createClient(url, function(err, client) {
            client.runReport(args, function(err, result) {
                console.log(result);
            });
        });
    }
    catch(e){
        console.log("Error  :" + e);
    }
    
    console.log("R 2");
}
