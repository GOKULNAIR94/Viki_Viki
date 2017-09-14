module.exports = function(ticket, response) {

    var https = require('https');
    var speech = "";
    console.log( "ticket : " + JSON.stringify(ticket));
    
    var newoptions = {
        host: 'ntinfotech--tst.custhelp.com',
        path: '/services/rest/connect/latest/incidents',
        method: 'POST',
        headers: {
            'Authorization': 'Basic cHBhdGthcjpsbnRMTlQxMjM0',
            'Content-Type' : 'application/json',
            'Connection': 'Keep-Alive'


        }
    };
    
    var body = "";
    var responseObject;
    var post_req = https.request(newoptions, function(res) {
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
            body = body + chunk;
        });
        res.on('end', function() {
            console.log( "Body : " + body);
//            responseObject = JSON.parse(body);
//            speech = "Ok! I will put in a ticket in ServiceNow for the Hyperion Support Team to look into this. Please specify the priority!";
//            return res.json({
//                speech: speech,
//                displayText: speech,
//                //source: 'webhook-OSC-oppty'
//            })
        })
    }).on('error', function(e) {
        console.error(e);
    });
    post_req.write(JSON.stringify(ticket));
    post_req.end();
}