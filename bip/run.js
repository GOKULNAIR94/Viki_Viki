module.exports = function ( req, res, callback){ 
    var soap = require('soap');
    var base64 = require('file-base64');
    var SendEmail = require("./sendEmail");
    var reportAbsolutePath = "Custom/BIPTest/Tickets.xdo";
    var reportName = reportAbsolutePath.substring( reportAbsolutePath.lastIndexOf('/')+1, reportAbsolutePath.lastIndexOf('.xdo'))
    var fileName = "test.jpeg" //reportName + '.pdf';
    var emailContent = {};

    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
    var args = {
        "reportRequest" : {
            "attributeFormat" :"pdf",
            "reportAbsolutePath" : reportAbsolutePath
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
            var base64String = "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";
//            var base64String = result.runReportReturn.reportBytes;
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
//module.exports = function ( req, res, callback){ 
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
