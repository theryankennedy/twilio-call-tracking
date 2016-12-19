var mongoose = require('mongoose');

var PoolNumberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  pool: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  dateUsed: {
    type: Date,
    require: false
  }
});

// Create a Mongoose model from our schema
var PoolNumber = mongoose.model('PoolNumber', PoolNumberSchema);

// export model as our module interface
module.exports = PoolNumber;