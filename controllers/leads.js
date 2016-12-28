var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
//var CallSource = require('../models/CallSource');
var Lead = require('../models/Lead');
var config = require('../config');
var sync = require('./sync');
var charts = require('./charts');
//var LookupsClient = require('twilio').LookupsClient;
//var client = new LookupsClient(config.accountSid, config.authToken);


exports.createLead = function(params) {
  var callSourceNumber = params.To;
  var forwardingNumber = config.ivrNumber; //'+14089164333'
  var twiml = new twilio.TwimlResponse();
  var addOnResults = JSON.parse(params.AddOns);
  var spamResults = addOnResults.results['marchex_cleancall'];
  var nextCallerResults = addOnResults.results['nextcaller_advanced_caller_id'];
  //var client = LookupsClient(config.accountSid, config.authToken);

  //console.log('caller ID Info: ');

  //Create new Lead
  var newLead = new Lead({
    callerNumber: params.From,
    city: params.FromCity,
    state: params.FromState,
    callerName: params.CallerName,
    blacklisted: spamResults.result.result.recommendation,
    blacklistedReason: spamResults.result.result.reason,
    createdOn: new Date()
  });
console.log('nextCallerResults');
  console.log(nextCallerResults.result.records);
  if (nextCallerResults.result.records != null) {
    newLead.gender = nextCallerResults.result.records[0].gender || 'Male';
  }

  if (nextCallerResults.result.records != null) {
    newLead.age = parseInt(nextCallerResults.result.records[0].age || 25, 10)
  }
  
  Lead.findOne({
    callerNumber: params.From
  }).then(function(foundLead) {
    if (foundLead == null) {
     return newLead.save();
    }
  }).catch(function(error) {
        console.log('Error finding Call');
        console.log(error);
  });
};

exports.getLeads = function(request, response) {
  Lead.find().then(function(existingLeads) {
    response.send(existingLeads);
  });
};

// exports.show = function(request, response) 
//   Lead.find().then(function(leads) {
//     return response.render('concierge', {
//       leads: leads
//     });
//   });
// };
