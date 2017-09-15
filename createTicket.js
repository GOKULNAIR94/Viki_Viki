module.exports = function(ticket, response) {

    console.log("ticket : " + JSON.stringify(ticket));

    var request = require("request");

    var options = {
        method: 'POST',
        url: 'https://ntinfotech--tst.custhelp.com/services/rest/connect/latest/incidents/',
        headers: {
            'postman-token': '2e164913-425e-4d15-e09a-5d479d31c1d5',
            'cache-control': 'no-cache',
            authorization: 'Basic cHBhdGthcjpsbnRMTlQxMjM0'
        },
        body: ticket
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        response.json(body);
    });

}