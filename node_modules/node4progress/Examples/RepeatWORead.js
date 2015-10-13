
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var server = require('http').Server(app);
var io = require('socket.io-client');
var socket = io('http://localhost:3000/capture2');

var conf = require("./config/configQAD.json");
// Instantiate node4progress
var node4progress = require("node4progress")(conf);
// Define appserver procedure to call
node4progress.setAppsvrProc("Examples/ReadWorkOrder.p", "", false, true);
// Define appserver procedure parameters

node4progress.setParameter("Imode", "character", "input", "GetCustomer", "");
node4progress.setParameter("oOutputPars", "character", "output", "", "");
node4progress.setParameter("ReturnStatus", "character", "output", "", "");



function socketEmit() {

//socket.on('connect', function () {
//    console.log("connected");
    // Send an update to the newly connected dashboard socket
    var stats = { connections: 1,
        touch: 1,
        video: 1,
        pages: { 'http://127.0.0.1:3000/capture.html': 1 }
    };
    socket.emit('status-updated', stats);
}



function checkDataChange() {
    node4progress.invoke(function (err, result) {
        node4progress.invoke(function (err, result) {
            jsonObj = JSON.parse(result);
            console.log("Customer update Result->" +
            				    "\n   ->oOutputPars->" + jsonObj.output.oOutputPars +
            				    "\n   ->ReturnStatus->" + jsonObj.output.ReturnStatus);
        });
    });
}


setInterval(socketEmit, 1000);


//node4progress.setParameter("Imode","character","input","GetCustomer","");
//node4progress.setParameter("iInputParameters","character","input","mode=FromTo|cust-num-from=1000|cust-num-to=9999","");
//node4progress.setParameter("dsCustomer","table-handle","input-output","","Examples/CustUpdTt-SchemaProvider.p");
//node4progress.setParameter("oOutputPars","character","output","","");
//node4progress.setParameter("ErrMsg","character","output","","");
//// Invoke appserver procedure


//node4progress.invoke(function(err,result){
//	var newName = "John Doe the 3rd";
//	var newAddress = "1567 Leisure Lane";
//	var newCity = "Port Saint Lucie";
//	var newState = "FL";
//	var newCountry = "USA";
//	// Get temp-table from appserver output
//	var ttCustomer = node4progress.getTempTable("ttCustomer",result);
//	// Get last record in temp-table
//	var ttCustBuf = ttCustomer.findLast();
//	
//	var displayMsg = "";	
//	displayMsg = "Pre-update values\n" +
//	             "Cust-num : " + ttCustBuf.$("cust-num").$("screenValue") + "\n" +
//		         "Name     : " + ttCustBuf.$("name").$("screenValue") + "\n" +
//                 "Address  : " + ttCustBuf.$("Address").$("screenValue")	+ "\n" +
//                 "City     : " + ttCustBuf.$("City").$("screenValue")	+ "\n" +
//                 "Country  : " + ttCustBuf.$("Country").$("screenValue")	+ "\n";
//	
//	console.log(displayMsg);
//	// Populate buffer with new values
//	ttCustBuf.$("name").bufferValue(newName);
//	ttCustBuf.$("Address").bufferValue(newAddress);
//	ttCustBuf.$("City").bufferValue(newCity);
//	ttCustBuf.$("Country").bufferValue(newCountry);
//	ttCustBuf.$("State").bufferValue(newState);

//	displayMsg = "Post-uodate values\n" +
//	             "Cust-num : " + ttCustBuf.$("cust-num").$("screenValue") + "\n" +
//				 "Name     : " + ttCustBuf.$("name").$("screenValue") + "\n" +
//				 "Address  : " + ttCustBuf.$("Address").$("screenValue")	+ "\n" +
//				 "City     : " + ttCustBuf.$("City").$("screenValue")	+ "\n" +
//				 "Country  : " + ttCustBuf.$("Country").$("screenValue")	+ "\n";
//	
//	console.log(displayMsg);
//	// Create empty copy of temp-table
//	var ttCustomerCopy=ttCustomer.copyTempTable(true);
//	//Copy updated values into copy of temp-table
//	ttCustomerCopy.bufferCreate();
//	ttCustomerCopy.bufferCopy(ttCustBuf.writeJson());
//	// Define appserver procedure to call	
//	node4progress.setAppsvrProc("Examples/CustUpdTt.p","",false,true);
//	// Define appserver procedure parameters 
//	node4progress.setParameter("Imode","character","input","UPDATE","");
//	node4progress.setParameter("iInputParameters","character","input","","");
//	node4progress.setParameter("dsCustomer","table-handle","input-output",ttCustomerCopy.writeJson(),"Examples/CustUpdTt-SchemaProvider.p");
//	node4progress.setParameter("oOutputPars","character","output","","");
//	node4progress.setParameter("ErrMsg","character","output","","");
//	// Invoke the appserver procedure
//	node4progress.invoke(function(err,result){
//		jsonObj=JSON.parse(result);
//		console.log("Customer update Result->"+
//				    "\n   ->oOutputPars->"+jsonObj.output.oOutputPars+
//				    "\n   ->ErrMsg->"+jsonObj.output.ErrMsg);
//	});
//});

