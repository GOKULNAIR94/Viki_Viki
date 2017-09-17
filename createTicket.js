module.exports = function( ticket, callback ) {

    console.log("Crete Tkt: ticket : " + JSON.stringify(ticket));

    var request = require("request");
    var output;
    var varAuth = 'Basic cHBhdGthcjpsbnRMTlQxMjM0';

    var options = {
        method: 'POST',
        url: 'https://ntinfotech--tst.custhelp.com/services/rest/connect/latest/incidents/',
        headers: {
            'postman-token': '2e164913-425e-4d15-e09a-5d479d31c1d5',
            'cache-control': 'no-cache',
            authorization: varAuth
        },
        body: JSON.stringify(ticket)
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        output = JSON.parse(body);
        console.log(output.id);
        return callback( output.id );
    });

}