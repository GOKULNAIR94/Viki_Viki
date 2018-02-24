module.exports = function ( req, resp, callback){ 
    var soap = require('soap');
    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/PublicReportService?wsdl';
    var args = {};
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('LNT001', 'lntLNT2K16_1'));
        client.runReport(args, function(err, result) {
//            console.log(result);
            var obj = JSON.parse( "{" + result + "}");
            console.log("Obj : " + obj.body);
        });
    });
}


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
