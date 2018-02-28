module.exports = function ( qString, body, req, resp, callback){ 
    var http = require("https");
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

    req.write( body.toString() );
    req.end();
}
