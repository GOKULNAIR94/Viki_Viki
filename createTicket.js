module.exports = function( ticket, res ) {

    console.log("ticket : " + JSON.stringify(ticket));

    var request = require("request");
    var output;

    var options = {
        method: 'POST',
        url: 'https://ntinfotech--tst.custhelp.com/services/rest/connect/latest/incidents/',
        headers: {
            'postman-token': '2e164913-425e-4d15-e09a-5d479d31c1d5',
            'cache-control': 'no-cache',
            authorization: 'Basic cHBhdGthcjpsbnRMTlQxMjM0'
        },
        body: JSON.stringify(ticket)
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        
        output = JSON.parse(body);
        console.log(output.id);
        var tId = output.id;
        speech = "I have put in a ticket in servicenow for the hyperion support team to look into this. You will be notified once data been restored. Here's the ticket number for reference: Incident Id : " + tId;
        return res.json({
            speech: speech,
            displayText: speech,
            //source: 'webhook-OSC-oppty'
        })
    });

}