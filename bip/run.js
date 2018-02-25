module.exports = function ( req, resp, callback){ 
    var soap = require('soap');
    var base64 = require('file-base64');

    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
    var args = {
        "reportRequest" : {
            "attributeFormat" :"pdf",
            "reportAbsolutePath" : "Custom/BIPTest/Tickets.xdo"
        },
        "userID" : "LNT001",
        "password" : "lntLNT2K16_1"
    };
    soap.createClient(url, function(err, client) {
//        client.setSecurity(new soap.BasicAuthSecurity('LNT001', 'lntLNT2K16_1'));
        client.runReport(args, function(err, result) {
            console.log( "Run : " + JSON.stringify(result) );
            console.log( "Run : " + result.statusCode );
            console.log( result.runReportReturn.reportBytes );
            var base64String = result.runReportReturn.reportBytes;
            base64.decode(base64String, 'text.new.pdf', function(err, output) {
              console.log('success : ' + output);
            });

            callback(result);
        });
    });
}

//module.exports = function ( req, resp, callback){ 
//    var soap = require('strong-soap').soap;
//    // wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
//    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
//
//    var requestArgs = {};
//    var clientOptions = {};
//    soap.createClient(url, clientOptions, function(err, client) {
//      var customRequestHeader = {Authorization: 'Basic TE5UMDAxOmxudExOVDJLMTZfMQ=='};
//      // Custom request header
//      client.runReport(requestArgs, function(err, result, envelope) {
//        // Result in SOAP envelope body which is the wrapper element.
//        // In this case, result object corresponds to GetCityForecastByZIPResponse.
//        console.log(JSON.stringify(result));
//      }, null, customRequestHeader);
//    });
//}


//
//module.exports = function ( req, resp, callback){ 
//    var http = require("https");
//
//    var options = {
//      "method": "POST",
//      "hostname": "acs.fs.ap2.oraclecloud.com",
//      "port": null,
//      "path": "/xmlpserver/services/PublicReportService?wsdl=",
//      "headers": {
//        "content-type": "text/xml"
//      }
//    };
//
//    var req = http.request(options, function (res) {
//      var chunks = [];
//
//      res.on("data", function (chunk) {
//        chunks.push(chunk);
//      });
//
//      res.on("end", function () {
//          console.log("Body : ");
//          var body = Buffer.concat(chunks);
//          console.log(body.toString());
////          console.log(atob(body.toString()));
//      });
//    });
//
//    req.write("<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:pub=\"http://xmlns.oracle.com/oxp/service/PublicReportService\">\n   <soapenv:Header/>\n   <soapenv:Body>\n      <pub:runReport>\n         <pub:reportRequest>\n            <pub:reportAbsolutePath>Custom/BIPTest/Tickets.xdo</pub:reportAbsolutePath>\n         </pub:reportRequest>\n         <pub:userID>LNT001</pub:userID>\n         <pub:password>lntLNT2K16_1</pub:password>\n      </pub:runReport>\n   </soapenv:Body>\n</soapenv:Envelope>");
//    req.end();
//}
