var twilioLibrary = require('twilio');
var config = require('../config');

var client = new twilioLibrary.Twilio(config.accountSid, config.authToken);

exports.index = function(request, response) {

  var areaCode = request.query.areaCode;

  client.availablePhoneNumbers('US').local.list({
    areaCode: areaCode
  }).then(function(availableNumbers) {
    //console.dir(availableNumbers);
    response.render('availableNumbers', {
      availableNumbers: availableNumbers
    });
  }).catch(function(failureToFetchNumbers) {
    console.log('Failed to fetch numbers from API');
    console.log('Error was:');
    console.log(failureToFetchNumbers);
    response.status(500).send('Could not contact Twilio API');
  });
};
