module.exports = function(ticket, response) {

    var http = require('https');
    var speech = "";
    console.log( "ticket : " + JSON.stringify(ticket));
    
    var options = {
      "method": "POST",
      "hostname": "ntinfotech--tst.custhelp.com",
      "port": null,
      "path": "/services/rest/connect/latest/incidents/",
      "headers": {
        "authorization": "Basic cHBhdGthcjpsbnRMTlQxMjM0",
        "cache-control": "no-cache",
        "postman-token": "0f6c028e-bdc2-ecff-3b65-da4e82a4acd5"
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

    req.write("{\r\n    \"primaryContact\": {\r\n        \"id\": 60\r\n    },\r\n    \"assignedTo\": {\r\n        \"staffGroup\": {\r\n            \"lookupName\": \"Admin\"\r\n        }\r\n    },\r\n    \"customFields\": {\r\n        \"c\": {\r\n            \"description\": \"no\",\r\n            \"priority\": {\r\n                \"lookupName\": \"1 - High\"\r\n            }\r\n        }\r\n    },\r\n    \"statusWithType\": {\r\n        \"status\": {\r\n            \"lookupName\": \"Unresolved\"\r\n        }\r\n    },\r\n    \"subject\": \"GL data is missing in FinRpt for 2017 for Actuals scenario 1\"\r\n}");
    req.end();
}