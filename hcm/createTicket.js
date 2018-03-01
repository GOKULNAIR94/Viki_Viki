module.exports = function( ticket, callback ) {
    var http = require("https");

    var options = {
      "method": "POST",
      "hostname": "dev38652.service-now.com",
      "port": null,
      "path": "/api/now/table/incident",
      "headers": {
        "authorization": "Basic YWRtaW46T3JhY2xlMTIz",
        "content-type": "application/json",
        "cache-control": "no-cache"
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
          var output = JSON.parse(body);
          callback( output.result.number );
      });
    });

    req.write(JSON.stringify(ticket));
    req.end();

//    console.log("Crete Tkt: ticket : " + JSON.stringify(ticket));
//
//    var request = require("request");
//    var output;
//    var varAuth = 'Basic cHBhdGthcjpMVElsdGkxMjM=';
//
//    var options = {
//        method: 'POST',
//        url: 'https://ntinfotech--tst.custhelp.com/services/rest/connect/latest/incidents/',
//        headers: {
//            'postman-token': '2e164913-425e-4d15-e09a-5d479d31c1d5',
//            'cache-control': 'no-cache',
//            authorization: varAuth
//        },
//        body: JSON.stringify(ticket)
//    };
//
//    request(options, function(error, response, body) {
//        if (error) throw new Error(error);
//
//        output = JSON.parse(body);
//        console.log(output.id);
//        console.log(output.lookupName);
//        callback( output.lookupName );
//    });

}