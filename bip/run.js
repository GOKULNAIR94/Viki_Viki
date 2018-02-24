module.exports = function ( req, resp, callback){ 
    var http = require("https");

    var options = {
      "method": "POST",
      "hostname": "acs.fs.ap2.oraclecloud.com",
      "port": null,
      "path": "/xmlpserver/services/PublicReportService?wsdl=",
      "headers": {
        "content-type": "text/xml",
        "cache-control": "no-cache",
        "postman-token": "05fdc3e5-c2f2-753a-d53e-dcfdbed7fb7a"
      }
    };

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    });

    req.write("<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:pub=\"http://xmlns.oracle.com/oxp/service/PublicReportService\">\n   <soapenv:Header/>\n   <soapenv:Body>\n      <pub:runReport>\n         <pub:reportRequest>\n            <pub:reportAbsolutePath>Custom/BIPTest/Tickets.xdo</pub:reportAbsolutePath>\n         </pub:reportRequest>\n         <pub:userID>LNT001</pub:userID>\n         <pub:password>lntLNT2K16_1</pub:password>\n      </pub:runReport>\n   </soapenv:Body>\n</soapenv:Envelope>");
    req.end();
}
