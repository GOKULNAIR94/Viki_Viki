module.exports = function(ticket, response) {

    var http = require('https');
    var speech = "";
    console.log( "ticket : " + JSON.stringify(ticket));
    
    var request = require("request");

    var options = { method: 'POST',
      url: 'https://ntinfotech--tst.custhelp.com/services/rest/connect/latest/incidents/',
      headers: 
       { 'postman-token': '2e164913-425e-4d15-e09a-5d479d31c1d5',
         'cache-control': 'no-cache',
         authorization: 'Basic cHBhdGthcjpsbnRMTlQxMjM0' },
      body: '{\r\n    "primaryContact": {\r\n        "id": 60\r\n    },\r\n    "assignedTo": {\r\n        "staffGroup": {\r\n            "lookupName": "Admin"\r\n        }\r\n    },\r\n    "customFields": {\r\n        "c": {\r\n            "description": "no",\r\n            "priority": {\r\n                "lookupName": "1 - High"\r\n            }\r\n        }\r\n    },\r\n    "statusWithType": {\r\n        "status": {\r\n            "lookupName": "Unresolved"\r\n        }\r\n    },\r\n    "subject": "GL data is missing in FinRpt for 2017 for Actuals scenario 1"\r\n}' };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
    });

}