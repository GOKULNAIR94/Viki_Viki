module.exports = function(req, res) {

    var fs = require('fs');
    var jsonQuery = require('json-query');
    
    var DCPHireTerm = require("./dcpHireTerm");
    var DCPJVWL = require("./dcpJVWL");
    
    var content;
    var speech;
    var intentName = req.body.result.metadata.intentName;

    var Name = "";
    var attrib = "";
    var HireTermOG = "";
    var attribOG = "";
    var countFlag = 0;

    var filePath = "";
    var query = "";
    var HeadCountQuery = "";
    
    

    if ( intentName == "DCP - EmployeeData" || intentName == "DCP - EmployeeData - custom" ) {
        attrib = req.body.result.parameters['DCP_AttribsGeneral'];
        Name = req.body.result.contexts[0].parameters['Name.original'];
        filePath = "./data/EmployeeData.json";
        query = "Name = " + Name;
        query = [{
            "key" : "Name",
            "opt" : "==",
            "value" : Name
        }];
    }

    if ( intentName.indexOf( "DCP - Voucher" ) == 0 ) {
        attrib = req.body.result.contexts[0].parameters['VouchAttrib'];
        filePath = "./data/VoucherTable.json";
        query = "VOUCHER_ID = " + req.body.result.contexts[0].parameters['VOUCHER_ID'];
        query = [{
            "key" : "VOUCHER_ID",
            "opt" : "==",
            "value" : req.body.result.contexts[0].parameters['VOUCHER_ID']
        }];
    }
    
    if ( intentName.indexOf( "DCP - WLTable" ) == 0 ) {
        filePath = "./data/WLTable.json";
        
        if ( intentName.indexOf( "DCP - WLTable - SLA" ) == 0 ) {
            var dDate = new Date();
            dDate.setDate(dDate.getDate() - 30);
            speech = "Date : " + dDate;
            attrib = "TRANS_DATE";
            var day = ( dDate.getDate() < 10 )? "0" + dDate.getDate() : dDate.getDate();
            var month = ( (dDate.getMonth()+1) < 10 )? "0" + (dDate.getMonth()+1) : (dDate.getMonth()+1);
            var strDate = "" + month + "/" + day +  "/" +dDate.getFullYear();
            query = [{
                "key" : "TRANS_DATE",
                "opt" : "<",
                "value" : strDate
            }];
            //query = "TRANS_DATE < " + strDate;
        }
        else{
            if( req.body.result.contexts[0].parameters['WLAttrib'] != "" && req.body.result.contexts[0].parameters['WLAttrib'] != null ){
                Name = req.body.result.contexts[0].parameters['INSTANCEID'];
                attrib = req.body.result.contexts[0].parameters['WLAttrib'];
                attribOG = req.body.result.contexts[0].parameters['WLAttrib.original'];
                //query = "INSTANCEID = " + req.body.result.contexts[0].parameters['INSTANCEID'];
                query = [{
                    "key" : "INSTANCEID",
                    "opt" : "==",
                    "value" : req.body.result.contexts[0].parameters['INSTANCEID']
                }];
            }
            else{
                attrib = "TRANS_DATE";
                //query = "BUSPROCNAME = " + "DCP_VOUCHER_APPROVAL";
                query = [{
                    "key" : "BUSPROCNAME",
                    "opt" : "==",
                    "value" : "DCP_VOUCHER_APPROVAL"
                }];
            }
        }
            
        
    }

    if ( intentName.indexOf( "DCP - HeadCount" ) == 0 ) {
        attrib = "Headcount";
        filePath = "./data/Headcount.json";
        if (req.body.result.parameters.ED_Dept != null && req.body.result.parameters.ED_Dept != ""){
            //query = "Department = " + req.body.result.parameters.ED_Dept;
            query = [{
                "key" : "Department",
                "opt" : "==",
                "value" : req.body.result.parameters.ED_Dept
            }];
            HeadCountQuery = req.body.result.parameters.ED_Dept;
        }
            
        if (req.body.result.parameters.ED_WorkLocation != null && req.body.result.parameters.ED_WorkLocation != ""){
            query = "Location = " + req.body.result.parameters.ED_WorkLocation;
            query = [{
                "key" : "Location",
                "opt" : "==",
                "value" : req.body.result.parameters.ED_WorkLocation
            }];
            HeadCountQuery = req.body.result.parameters.ED_WorkLocation;
        }
            

    }

    
    
    if (intentName == "DCP - WorklistApproval") {
        Name = req.body.result.contexts[0].parameters['Name.original'];
        filePath = "./data/WorklistApproval.json";
        query = "Employee = " + Name;
        attrib = "Details";
    }


    if ( intentName.indexOf( "DCP - HireTerm" ) == 0 ) {
        DCPHireTerm(req, res, function(result) {
          console.log("EmpData Called");
            speech = result.speech;
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        });
    }
    
    if ( intentName.indexOf( "DCP - JRNL" ) == 0 ) {
        DCPJVWL(req, res, function(result) {
          console.log("JRNL Called");
            speech = result.speech;
            return res.json({
                speech: speech,
                displayText: speech,
                //source: 'webhook-OSC-oppty'
            })
        });
    }
    
    if ( intentName.indexOf( "DCP - EmployeeData" ) == 0 ||  intentName.indexOf( "DCP - WorklistApproval" ) == 0 ||  intentName.indexOf( "DCP - HeadCount" ) == 0 || intentName.indexOf( "DCP - Voucher" ) == 0 || intentName.indexOf( "DCP - WLTable" ) == 0){
       content = fs.readFileSync(filePath, 'utf8');
        //console.log("Content : " + content);


        

        content = JSON.parse(content);
        //console.log("Content :" + JSON.stringify(content));
        console.log("query :" + query);
        console.log("attrib :" + attrib);

        var output = [];
        for(var i = 0; i < content.length; i++){
            theString = '"' + content[i][query[0].key].toLowerCase() + '"' + query[0].opt + '"' +  query[0].value.toLowerCase() + '"';
            console.log( "The String : " + theString );
            if( eval( theString ) ){
                output.push( content[i][attrib] );
                console.log("output :" + output);
            }
        }
        
//            jsonQuery('[* ' + query + ']' + '[' + attrib + ']', {
//                data: content
//            }).value;
        console.log("output :" + output);

        if (output.length == 0) {
            speech = "No records found.";
        } else {
            if( intentName == "DCP - WorklistApproval"){
                speech = "There are " + output.length + " approval(s) pending. ";
                for( var i = 0; i < output.length; i++){
                    speech = speech + "\n " + (i+1) + ". " + output[i] + ".";
                }
            }
            else{
                if ( intentName.indexOf( "DCP - WLTable" ) == 0 ) {
                    if ( intentName.indexOf( "DCP - WLTable - SLA" ) == 0 ) {
                        speech = "There are " + output.length + " vouchers violating SLA.";
                    }
                    else{
                           if( req.body.result.contexts[0].parameters['WLAttrib'] != "" && req.body.result.contexts[0].parameters['WLAttrib'] != null ){
                               var TransDate = new Date(output[0]);
                               speech = "The " + attribOG + " of " + Name + " is " + output[0] + ".";
                           }
                           else{
                               var dates = [];
                                for(var i =0; i< output.length; i++ ){
                                    dates.push(new Date( output[i] ) );
                                }
                               var minFullDate=new Date(Math.min.apply(null,dates));
                               
                               
                                var day = ( minFullDate.getDate() < 10 )? "0" + minFullDate.getDate() : minFullDate.getDate();
                                var month = ( (minFullDate.getMonth()+1) < 10 )? "0" + (minFullDate.getMonth()+1) : (minFullDate.getMonth()+1);
                                var minDate = "" + month + "/" + day +  "/" +minFullDate.getFullYear();
                               
                               
                               //var minDate = "" + (minFullDate.getMonth()+1) + "/" + minFullDate.getDate() +  "/" + minFullDate.getFullYear();
                               if( intentName == "DCP - WLTable - custom-2"){
                                   query = "BUSPROCNAME = DCP_VOUCHER_APPROVAL & TRANS_DATE = " + minDate;
                                   query = "console.log(' Evalled The Query' + query);";
                                   eval(query.toLowerCase());
                                   //console.log("The Query :" + query);
                                   var output = {
                                       "key" : "value"
                                   };

                                   for(var i = 0; i < content.length; i++)
                                    {
                                      if( content[i].BUSPROCNAME == 'DCP_VOUCHER_APPROVAL'  && content[i].TRANS_DATE == minDate )
                                      {
                                          output.INSTANCEID = content[i].INSTANCEID;
                                          output.TRANSACTIONID = content[i].TRANSACTIONID;
                                          output.EVENTNAME = content[i].EVENTNAME;
                                          output.WORKLISTNAME = content[i].WORKLISTNAME;
                                          output.TRANS_DATE = content[i].TRANS_DATE;
                                          break;
                                      }
                                    }



//                                   var INSTANCEID = jsonQuery('[ ' + query + ']' + '[INSTANCEID]', {
//                                                    data: content
//                                                }).value;
//                                   var TRANSACTIONID = jsonQuery('[ ' + query + ']' + '[TRANSACTIONID]', {
//                                                        data: content
//                                                    }).value;
//                                   var EVENTNAME = jsonQuery('[ ' + query + ']' + '[EVENTNAME]', {
//                                                        data: content
//                                                    }).value;
//                                   var WORKLISTNAME = jsonQuery('[ ' + query + ']' + '[WORKLISTNAME]', {
//                                                        data: content
//                                                    }).value;
//                                   var TRANS_DATE = jsonQuery('[ ' + query + ']' + '[TRANS_DATE]', {
//                                                        data: content
//                                                    }).value;
                                   
                                    if ( output.INSTANCEID != null ) {
                                        speech = "The Instance Id of the voucher is : " + output.INSTANCEID +
                                           ",\n and few more details: \nTransaction Id : " + output.TRANSACTIONID +
                                           ",\n Event Name : " + output.EVENTNAME +
                                           ",\n Worklist Name : " + output.WORKLISTNAME +
                                           ",\n Transaction Date : " + output.TRANS_DATE + ".";
                                    }
                                   else{
                                       speech = "Something went wrong!";
                                   }

                                   
                               }
                               else{
                                   speech = "There are " + output.length + " voucher(s) awaiting approval. The earliest transaction date is " + minDate;
                               }
                               
                           }
                       }
                   }
                else
               {
                   if (output.length == 1) {
                       if ( intentName.indexOf( "DCP - EmployeeData" ) == 0 ){
                           speech = "The " + attrib + " of " + Name + " is " + output[0] + ".";
                       }
                       if ( intentName.indexOf( "DCP - HeadCount" ) == 0 ) {
                           speech = "The Headcount of " + HeadCountQuery + " is " + output[0] + ".";
                       }
                       if ( intentName.indexOf( "DCP - Voucher" ) == 0 ) {
                           if( output[0] == "Pending Approval" )
                               speech = "The Voucher " + req.body.result.contexts[0].parameters['VOUCHER_ID'] + " is awaiting approval.";
                           else
                               speech = "The Voucher " + req.body.result.contexts[0].parameters['VOUCHER_ID'] + " is " + output[0] + ".";
                       }
                    } else
                    if (output.length > 1) {
                            speech = "More than one record found.";
                   }
               }
            }

        }


        return res.json({
            speech: speech,
            displayText: speech,
            //source: 'webhook-OSC-oppty'
        })
       }

}