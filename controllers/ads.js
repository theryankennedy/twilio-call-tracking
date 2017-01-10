var config = require('../config');
var PoolNumber = require('../models/PoolNumber');
var twilio = require('twilio');
var client = new twilio.Twilio(config.accountSid, config.authToken);

exports.show = function(request, response) {
    return response.render('ad');
};

exports.getNumber = function(req, res) {

  if (!req.query.campaign) {
    response.status(400).send('campaign is missing');
  }

  // find one that is ready, if there isn't one and we are below max buy
  PoolNumber.findOne({$or: [{status : 'ready'}, {status : ''}]})
  .then(poolNumber => {
    if (!poolNumber) {
      client.availablePhoneNumbers('US').local
      .list({})
      .then((data) => {
        const number = data[0];
        return client.incomingPhoneNumbers.create({
          phoneNumber: number.phoneNumber,
          voiceCallerIdLookup: '1',
          voiceApplicationSid: config.appSid
        });
      })
      .then((purchasedNumber) => {
        var poolNumber = new PoolNumber({
          number: purchasedNumber.phoneNumber,
          pool: req.query.campaign,
          status: 'used',
          dateUsed: new Date(),
          gaId: req.query.gaid
        });
        poolNumber.save();
        console.log('just bought ' + purchasedNumber.phoneNumber);
        return Promise.resolve(poolNumber);
      }).then((poolNumber) => {
        res.send(poolNumber);
      }).catch(function(numberPurchaseFailure) {
        console.log('Could not purchase a number for call source:');
        console.log(numberPurchaseFailure);
        response.status(500).send('Could not contact Twilio API');
      });
    } else {
      poolNumber.status = 'used';
      poolNumber.save();
      res.send(poolNumber);
    }

  });
}

exports.getNumbers = function(req, res) {
  PoolNumber.find()
  .then(numbers => {
    res.send(numbers);
  });
}

exports.addNumber = function(req, res) {
  if (!req.query.number) {
    res.sendStatus(400);
  }
  var poolNumber = new PoolNumber({
    number: req.query.number,
    pool: req.query.pool,
    status: 'ready'
  });

  poolNumber.save();
  res.send(poolNumber);
}

exports.resetPoolNumberStatus = function(req, res) {
  PoolNumber.update({
       pool: req.query.campaign
      }, {
        $set: { status: 'ready' }
      }, {
        multi: true
      }, function() {
        console.log('ok we reset things');
      });

}
