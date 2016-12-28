var mongoose = require('mongoose');

var CallSourceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  forwardingNumber: {
    type: String,
    required: false
  }
});

// Create a Mongoose model from our schema
var CallSource = mongoose.model('CallSource', CallSourceSchema);

// export model as our module interface
module.exports = CallSource;
