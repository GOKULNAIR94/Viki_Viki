module.exports = function(req, resp, callback) {
    var soap = require('soap');
    var url = 'https://hcm-aufsn4x0cma.oracleoutsourcing.com/xmlpserver/services/v2/ScheduleService?wsdl';
  
    
    var args = {
        "dataModelUrl": "/Custom/KaamanAgarwal/Payslip.xdm",
        "scheduleRequest": {
            "notificationTo": "gokul.nair@lntinfotech.com",
            "notifyWhenSuccess": true,
            "notifyWhenWarning": true,
            "deliveryChannels": {
                "emailOptions": [{
                    "item": {
                        "emailBody": "Hello Gokul",
                        "emailFrom": "Viki@Future.com",
                        "emailServerName": "DefaultEmail",
                        "emailSubject": "Opty Report",
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