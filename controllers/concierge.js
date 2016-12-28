var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //create express app
var twilio = require('twilio');
var CallSource = require('../models/CallSource');
var Call = require('../models/Call');
var Lead = require('../models/Lead');
var config = require('../config');
//var ejs = require('ejs');

exports.incall = function(request, response) {
//app.get ("/xyz", function(req,res){
	// response.contentType('application/xml');
	// response.redirect('/dial.xml');
	var twiml = new twilio.TwimlResponse();
	  twiml.dial(function(dialNode) {
    	dialNode.client('human');
    	});
   // response.set('Content-Type', 'text/xml');
  	response.send(twiml.toString());
};

//app.get ('/token',function(req,res){
exports.token = function(request, response) {

	let identity = 'human'

	var capability = new twilio.jwt.Capability(
        config.accountSid,
        config.authToken
    );

	// Give the capability generator permission to make outbound calls
	    capability.allowClientOutgoing(config.clientSid);
	    capability.allowClientIncoming('human');

    // Render an HTML page which contains our capability token
	   // response.render('concierge.jade', {
	   //  token:capability.generate()
	   // });]
	  response.send({ token: capability.generate()});

};

// app.get ('/call',function(req,res){
// 	res.render('call.ejs');
// 	});

 //call from client to pstn
 exports.makecall = function(request, response) {
 //app.get ('/makecall',function(req,res){
		var tocall = request.param('tocall'); // custom parameter from Twilio.Device.connect
		var twiml = new twilio.TwimlResponse();
		console.log(tocall);
		twiml.dial(
		    tocall,
		    { callerId: config.clientCallerId}
		 );
    response.send (twiml.toString());
};

exports.show = function(request, response) {
   // return response.render('concierge', {
    Lead.find().then(function(leads) {
    	return response.render('concierge', {
      		leads: leads
    	});
    }).catch(function(error) {
    	console.log('error');
    });
};

