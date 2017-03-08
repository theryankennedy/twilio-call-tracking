var express = require('express');
var bodyParser = require('body-parser');
var app = express(); //create express app

var twilio = require('twilio');

// models
var CallSource = require('../models/CallSource');
var Call = require('../models/Call');
var Lead = require('../models/Lead');

// config
var config = require('../config');

exports.incall = function(request, response) {
	var twiml = new twilio.TwimlResponse();
  twiml.dial(function(dialNode) {
  	dialNode.client(config.agentName);
  	});
	response.send(twiml.toString());
};

exports.token = function(request, response) {

	// Get the agent name from the config file.
	let identity = config.agentName;

	var capability = new twilio.jwt.Capability(
	      config.accountSid,
	      config.authToken
  );

	// Give the capability generator permission to make outbound calls
  capability.allowClientOutgoing(config.clientSid);
  capability.allowClientIncoming(identity);

  response.send({ token: capability.generate()});
};

 //call from client to pstn
 exports.makecall = function(request, response) {
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
  Lead.find().then(function(leads) {
  	return response.render('agent', {
    		leads: leads
  	});
  }).catch(function(error) {
  	console.log('error');
  });
};
