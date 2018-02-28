module.exports = function ( qString, body, req, res, callback){ 
    var http = require("https");
    var SendResponse = require("./sendResponse");
    
    var speech = "";
    var suggests = [];
    var contextOut = [];
    console.log( "qString : " + qString);
    
    var options = {
      "method": "PATCH",
      "hostname": "hcm-aufsn4x0cma.oracleoutsourcing.com",
      "port": null,
      "path": qString, //"//hcmCoreApi/resources/11.12.1.0/emps/00020000000EACED00057708000110D9317FA60C0000004AACED00057372000D6A6176612E73716C2E4461746514FA46683F3566970200007872000E6A6176612E7574696C2E44617465686A81014B5974190300007870770800000161D9B5680078"
      "headers": {
        "authorization": "Basic S2FhbWFuLkFnYXJ3YWw6T3JhY2xlMTIz",
        "content-type": "application/vnd.oracle.adf.resourceitem+json",
        "cache-control": "no-cache"
      }
    };

    var reqp = http.request(options, function (resp) {
      var chunks = [];

      resp.on("data", function (chunk) {
        chunks.push(chunk);
      });

      resp.on("end", function () {
          var output = Buffer.concat(chunks);
          console.log(output.toString());
          console.log("Status Code : " + resp.statusCode);
          speech = "Value is updated!";
          SendResponse(speech, suggests, contextOut, req, res, function() {
              console.log("Finished!");
          });
      });
    });

    reqp.write( JSON.stringify(body) );
    reqp.end();
}
