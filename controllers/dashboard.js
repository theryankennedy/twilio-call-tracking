var CallSource = require('../models/CallSource');
var config = require('../config');

exports.show = function(request, response) {
  CallSource.find().then(function(callSources) {
    return response.render('dashboard', {
      callSources: callSources,
      appSid: config.appSid
    });
  });
};
