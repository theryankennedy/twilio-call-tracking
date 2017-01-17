var twilio = require('twilio');
var _ = require('underscore');
var rp = require('request-promise');
//var CallSource = require('../models/CallSource');
var Lead = require('../models/Lead');
var CallSource = require('../models/CallSource');

var config = require('../config');
var sync = require('./sync');
var charts = require('./charts');
var faker = require('faker');
//var bodyParser = require('body-parser');
//var LookupsClient = require('twilio').LookupsClient;
//var client = new LookupsClient(config.accountSid, config.authToken);


exports.createLead = function(params, newCall,adgroup,keyword) {
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
    callSource: newCall.callSource,
    numberPool: newCall.numberPool,
    createdOn: new Date(),
    adgroup: adgroup,
    keyword:keyword
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

exports.getByCallerNumber = function(request, response) {
  Lead.findOne({
    callerNumber:request.params.callernumber
  }).then(function(activelead) {
      return response.send(activelead);
  });
};

exports.saveLead= function(request, response) {
  console.log('saveleads request.body');
  console.log(request.body);
  Lead.findOne({
    callerNumber:request.params.callernumber
  }).then(function(savelead) {
      savelead.qualified = request.body.qualified;
      if (request.body.revenue != null) {
        savelead.revenue = request.body.revenue || '0';
      }
      //response.send(savelead.save());
    return savelead.save();
  }).then(function(savedlead) {
    return response.send(savedlead);
  }).catch(function(error) {
    return response.status(500).send(error);
  });
};

 // });
//};

exports.show = function(request, response) {
  Lead.find().then(function(leads) {
    return response.render('leads', {
      leads: leads
    });
  });
};



exports.generateLeads = (request, response) => {

  var callSourceId = request.query.callSourceId;
  var numberOfLeads = request.query.numberOfLeads;

  CallSource.findOne({
    _id: callSourceId
  }).then(function(callsource) {

    if (!callsource) {
      return response.status(400);
    }

    var leads = [];
    var i;
    for (i = 0; i < numberOfLeads; i++) {

      //Create new Lead
      var newLead = new Lead({
        callerNumber: faker.phone.phoneNumber('1##########'),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        callerName: faker.name.firstName() + ' ' + faker.name.lastName(),
        gender: faker.random.arrayElement(['Male', 'Female']),
        age: faker.random.number({min: 18, max: 83}),
        blacklisted: "PASS",
        blacklistedReason: "CleanCall",
        callSource: callSourceId,
        createdOn: new Date(),
        adgroup: callsource.adgroup,
        keyword: callsource.keyword,
        revenue: faker.random.number({min: 50, max: 700}),
      });

      newLead.save();
      leads.push(newLead);
    }

    return response.send(leads);

  }).catch(function(error) {
    return response.status(500).send(error);
  });;

};
