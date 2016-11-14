var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //create express app
var twilio = require('twilio');
var LeadSource = require('../models/LeadSource');
var Lead = require('../models/Lead');
var config = require('../config');
//var ejs = require('ejs');

exports.incall = function(request, response) {
//app.get ("/xyz", function(req,res){
	// response.contentType('application/xml');
	// response.redirect('/dial.xml');
	var twiml = new twilio.TwimlResponse();
	  twiml.dial(function(dialNode) {
    	dialNode.client('t_1');
    	});
    response.set('Content-Type', 'text/xml');
  	response.send(twiml.toString());
};

//app.get ('/token',function(req,res){
exports.token = function(request, response) {

	var capability = new twilio.Capability(
        // "AC45d498ae5bf3da7ab29f27436bade725",
        // "1cec5f1c5a365de3a023c32a18c635db"
        config.accountSid,
        config.authToken
    );
	
	// Give the capability generator permission to make outbound calls
	    capability.allowClientOutgoing(config.clientSid);
	    capability.allowClientIncoming('t_1');

    // Render an HTML page which contains our capability token
	   response.render('concierge.jade', {
	    token:capability.generate()
	   });

	};

// app.get ('/call',function(req,res){
// 	res.render('call.ejs');
// 	});

 //call from client to pstn
 exports.makecall = function(request, response) {
 //app.get ('/makecall',function(req,res){
		var tocall = req.param('tocall'); // custom parameter from Twilio.Device.connect 
		var twiml = new twilio.TwimlResponse();
		twiml.dial(
		    tocall,
		    { callerId:'+13038080244'}       
		 );
    response.send (twiml.toString());
};

exports.show = function(request, response) {
    return response.render('concierge');
  };