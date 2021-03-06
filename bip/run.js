module.exports = function ( req, res, callback){ 
    var soap = require('soap');
    var base64 = require('file-base64');
    var SendEmail = require("./sendEmail");
    var reportAbsolutePath = "Custom/BIPTest/Tickets.xdo";
    var reportName = reportAbsolutePath.substring( reportAbsolutePath.lastIndexOf('/')+1, reportAbsolutePath.lastIndexOf('.xdo'))
    var fileName = reportName + '.pdf';
    var emailContent = {};

    var url = 'https://acs.fa.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
    var args = {
        "reportRequest" : {
            "attributeFormat" :"pdf",
            "reportAbsolutePath" : reportAbsolutePath
        },
        "userID" : req.body.headers.oscuser,
        "password" : req.body.headers.oscpw
    };
    soap.createClient(url, function(err, client) {
//        client.setSecurity(new soap.BasicAuthSecurity('LNT001', 'lntLNT2K16_1'));
        client.runReport(args, function(err, result) {
            console.log( "Run : " + JSON.stringify(result) );
            console.log( "Run : " + result.statusCode );
            console.log( result.runReportReturn.reportBytes );
            var base64String = result.runReportReturn.reportBytes;
            base64.decode(base64String, fileName, function(err, output) {
              console.log('success : ' + output);
                emailContent.speech = "Report has been scheduled.";
                emailContent.file = fileName;
                emailContent.subject = "Report "+reportName+" been scheduled.";
                emailContent.body = '<p><b>Hello,</b></p>' +
                    '<p>Attached is the Departmental Expenses Corporate Report as Requested.</p>' +
                    '<p>Thanks,<br><b>Viki</b></p>';

                SendEmail( emailContent, req, res, function(result) {
                    console.log("SendEmail Called");
                });
            });
            
            

            //callback(result);
        });
    });
}

//module.exports = function ( req, res, callback){ 
//    var soap = require('strong-soap').soap;
//    // wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
//    var url = 'https://acs.fa.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
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
//module.exports = function ( req, res, callback){ 
//    var http = require("https");
//
//    var options = {
//      "method": "POST",
//      "hostname": "acs.fa.ap2.oraclecloud.com",
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
