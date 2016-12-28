var twilio = require('twilio');
var config = require('../config');
var CallSource = require('../models/CallSource');

var client = new twilio.Twilio(config.accountSid, config.authToken);

exports.create = function(request, response) {
  var phoneNumberToPurchase = request.body.phoneNumber;
  
  client.incomingPhoneNumbers.create({
    phoneNumber: phoneNumberToPurchase,
    voiceCallerIdLookup: '1',
    voiceApplicationSid: config.appSid
  }).then(function(purchasedNumber) {
    var callSource = new CallSource({number: purchasedNumber.phoneNumber});
    return callSource.save();
  }).then(function(savedCallSource) {
    console.log('Saving call source');
    response.redirect(303, '/call-source/' + savedCallSource._id + '/edit');
  }).catch(function(numberPurchaseFailure) {
    console.log('Could not purchase a number for call source:');
    console.log(numberPurchaseFailure);
    response.status(500).send('Could not contact Twilio API');
  });
};

exports.edit = function(request, response) {
  var callSourceId = request.params.id;
  CallSource.findOne({_id: callSourceId}).then(function(foundCallSource) {
    return response.render('editCallSource', {
      callSourceId: foundCallSource._id,
      callSourcePhoneNumber: foundCallSource.number,
      callSourceForwardingNumber: foundCallSource.forwardingNumber,
      callSourceDescription: foundCallSource.description,
      messages: request.flash('error')
    });
  }).catch(function() {
    return response.status(404).send('No such call source');
  });
};

exports.update = function(request, response) {
  var callSourceId = request.params.id;

  request.checkBody('description', 'Description cannot be empty').notEmpty();
  request.checkBody('forwardingNumber', 'Forwarding number cannot be empty')
    .notEmpty();

  if (request.validationErrors()) {
    request.flash('error', request.validationErrors());
    return response.redirect(303, '/call-source/' + callSourceId + '/edit');
  }

  CallSource.findOne({_id: callSourceId}).then(function(foundCallSource) {
    foundCallSource.description = request.body.description;
    foundCallSource.forwardingNumber = request.body.forwardingNumber;

    return foundCallSource.save();
  }).then(function(savedCallSource) {
    return response.redirect(303, '/dashboard');
  }).catch(function(error) {
    return response.status(500).send('Could not save the call source');
  });
};

exports.show = function(request, response) {
  CallSource.find().then(function(callSources) {
    return response.render('callsources', {
      callSources: callSources,
      appSid: config.appSid
    });
  });
};
