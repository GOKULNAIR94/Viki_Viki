module.exports = function ( req, resp, callback){ 
    var http = require("https");
    console.LOG("RUN 1");
    var soap = require('soap');
    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/v2/ReportService?wsdl';
    var args = {};
    soap.createClient(url, function( "runReport", args, headers, req) {
        client.addSoapHeader(args, function(err, result) {
            return {
              Authorization: "Basic TE5UMDAxOmxudExOVDJLMTZfMQ=="
            };

        });
        client.runReport(args, function(err, result) {
            console.log(result);
            callback(result);
        });
    });
    console.LOG("R 2");
}
