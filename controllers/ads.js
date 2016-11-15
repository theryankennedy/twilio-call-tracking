var config = require('../config');
var PoolNumber = require('../models/PoolNumber');

exports.show = function(request, response) {
    return response.render('ad');
};

exports.getNumber = function(req, res) {
  PoolNumber.findOne({$or: [{status : 'ready'}, {status : ''}]})
  .then(number => {
    if (!number) {
      res.send({number : '+16027057926'});
    }

    number.status = 'used';
    number.save();
    
    res.send(number);
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
