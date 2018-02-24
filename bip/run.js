module.exports = function ( req, resp, callback){ 
    var http = require("https");
    console.log("RUN 1");
    var soap = require('soap');
    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/v2/ReportService?wsdl';
    var args = {};
    var methodName = "runReport";
    try{
        soap.createClient(url, function( methodName, args, headers, req) {
            client.addSoapHeader(args, function(err, result) {
                return {
                  Authorization: "Basic TE5UMDAxOmxudExOVDJLMTZfMQ=="
                };

            });
            client.methodName(args, function(err, result) {
                console.log(result);
                callback(result);
            });
        });
    }
    catch(e){
        console.log("Error  :" + e);
    }
    
    console.log("R 2");
}
