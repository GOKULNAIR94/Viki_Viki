module.exports = function ( req, resp, callback){ 
    var soap = require('soap');
    var url = 'https://acs.fs.ap2.oraclecloud.com/xmlpserver/services/v2/ScheduleService?wsdl';
//    var args = {
//        dataModelUrl :"/Custom/TestDM_g.xdm",
//        "reportRequest" : {
////            "reportAbsolutePath" : "Custom/BIPTest/Tickets.xdo"
//            "reportAbsolutePath" : "/Custom/TestDM_g.xdo"
//        },
//        "userID" : "LNT001",
//        "password" : "lntLNT2K16_1"
//    };
    
//    var args = {
//        dataModelUrl :"/Custom/BIPTest/TestDS.xdm",
//        endDate :"2018-03-10",   
//        notificationTo :"gokul.nair@lntinfotech.com",
//        notifyWhenFailed :true,
//        notifyWhenSuccess :true,
//        notifyWhenWarning :true,    
//        repeatCount :"0",
//        repeatInterval :"0",
//        userJobDesc :"My Template Test",
//        userJobName :"MyJob1111",
//        deliveryChannels:
//        {
//          emailOptions:
//          [{
//            item:
//            {
//              emailBody :"Hello,\nSending you the report in the pdf format\n\nThanks and regards,\nOSC Team\n\n",
//              emailFrom :"gokul.nair@lntinfotech.com",
//              emailServerName :"DefaultEmail",
//              emailSubject :"Opty Report",
//              emailTo :"gokul.nair@lntinfotech.com",
//              emailCC : "gokulgnair94@gmail.com"
//            }
//           
//          }]
//        
//        },
//        reportRequest:
//        {
//          attributeCalendar :"Gregorian",
//          attributeFormat :"HTML",     
//          attributeTemplate :"Opty Report",      
//          byPassCache :true,
//          flattenXML : false,
//          reportAbsolutePath :"/Custom/BIPTest/TestReport.xdo",  
//          parameterNameValues:{
//                listOfParamNameValues:
//                    [{ item: {
//                        UIType :"Text",
//                          dataType :"String",
//                          fieldSize : "20",
//                          label : "Record Id",
//                          multiValuesAllowed : false,
//                          name : "Id",
//                          refreshParamOnChange : false,
//                          selectAll :false,
//                          templateParam :false,
//                          useNullForAll :true,
//                        values:[{
//                          item:"300000006786070"
//                        }]
//                    }},{ 
//                        item: {
//                        UIType :"Text",
//                          dataType :"String",
//                          fieldSize : "20",
//                          label : "Object Name",
//                          multiValuesAllowed : false,
//                          name : "Object_Name",
//                          refreshParamOnChange : false,
//                          selectAll :false,
//                          templateParam :false,
//                          useNullForAll :true,
//                        values:[{
//                          item:"Deals_c"
//                        }]
//                    }}
//                    ]
//                    
//                }
//            },
//        "userID" : "LNT001",
//        "password" : "lntLNT2K16_1"
//        
//    };
    
    
    var args = {
        "dataModelUrl" :"/Custom/TestDM_g.xdm",
        "notificationTo" :"gokul.nair@lntinfotech.com",
        "notifyWhenSuccess" :true,
        "notifyWhenWarning" :true,
//        "deliveryChannels":
//        {
//          "emailOptions":
//          [{
//            "item":
//            {
//              "emailBody" :"Hello Gokul",
//              "emailFrom" :"gokul.nair@lntinfotech.com",
//              "emailServerName" :"DefaultEmail",
//              "emailSubject" :"Opty Report",
//              "emailTo" :"gokul.nair@lntinfotech.com",
//              "emailCC" : "gokulgnair94@gmail.com"
//            }
//           
//          }]
//        
//        },
        "reportRequest":
        {
          "attributeFormat" :"HTML",     
          "reportAbsolutePath" :"/Custom/TestDM_g.xdo"
            }
        
    };
    
    soap.createClient(url, function(err, client) {

        client.scheduleReport(args, "LNT001", "lntLNT2K16_1", function(err, result) {
            console.log( "Schedule : " + JSON.stringify(result) );
            console.log( "Schedule : " + result.statusCode );
        });
    });
}