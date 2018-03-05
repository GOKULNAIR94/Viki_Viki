module.exports = function(req, resp, callback) {
    var soap = require('soap');
    var url = 'https://hcm-aufsn4x0cma.oracleoutsourcing.com/xmlpserver/services/v2/ScheduleService?wsdl';
  
    var month = req.body.result.parameters.month, week = req.body.result.parameters.week, year = req.body.result.parameters.year;
    var args = {
        "dataModelUrl": "/Custom/KaamanAgarwal/Payslip.xdm",
        "scheduleRequest": {
            "notificationTo": "gokul.nair@lntinfotech.com",
            "notifyWhenSuccess": true,
            "notifyWhenWarning": true,
            "deliveryChannels": {
                "emailOptions": [{
                    "item": {
                        "emailBody": "Hi Kaaman,\n\nSending you the payslip for week " + week + " of " + month + " " + year + ".\n\nRegards,\nViki",
                        "emailFrom": "viki@kaaman.onmicrosoft.com",
                        "emailServerName": "DefaultEmail",
                        "emailSubject": "Payslip for the Month of " + month+" " + year,
                        "emailTo": "gokulgnair94@gmail.com",
                        "emailCC": "gokul.nair@lntinfotech.com",
                        "emailAttachmentName": "Kaaman_Agarwal_Payslip",
                        "emailCC": "gokul.nair@lntinfotech.com"
                    }

                }]

            },
            "reportRequest": {
                "attributeFormat": "pdf",
                "reportAbsolutePath": "/Custom/KaamanAgarwal/Payslip.xdo",
                "sizeOfDataChunkDownload": -1,  
              parameterNameValues:{
                    listOfParamNameValues:
                        [{ item: {
                            UIType :"Text",
                              dataType :"String",
                              fieldSize : "120",
                              label : "Week",
                              name : "Week",
                            values:[{
                              item:"1"
                            }]
                        }},
                         { item: {
                            UIType :"Text",
                              dataType :"String",
                              fieldSize : "120",
                              label : "Year",
                              name : "Year",
                            values:[{
                              item:"2018"
                            }]
                        }},
                         { item: {
                            UIType :"Text",
                              dataType :"String",
                              fieldSize : "120",
                              label : "Employee Name",
                              name : "EmployeeName",
                            values:[{
                              item:"Kaaman Agarwal"
                            }]
                        }},
                         { item: {
                            UIType :"Text",
                              dataType :"String",
                              fieldSize : "120",
                              label : "Month",
                              name : "Month",
                            values:[{
                              item:"January"
                            }]
                        }}
                        ]
                        
                    }
            }
        },

        "userID": "Kaaman.Agarwal",
        "password": "Oracle123"

    };

    soap.createClient(url, function(err, client) {

        client.scheduleReport(args, function(err, result) {
//            console.log(result);
//            console.log("Schedule : " + JSON.stringify(result));
            if(err){
                console.log("Schedule err: " + err);
                speech = "Unable to process your request. Please try again later.";
                resp.json({
                    speech: speech,
                    displayText: speech
                });
            }else{
                console.log("Schedule op: " + JSON.stringify(result));
                callback(result);
            }
            
        });
    });
}