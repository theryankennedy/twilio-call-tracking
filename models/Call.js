var mongoose = require('mongoose');

var CallSchema = new mongoose.Schema({
  callerNumber: {
    type: String,
    required: true
  },
  callSid: {
    type: String,
    required: true
  },
  callSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallSource'
  },
  ProNumber: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  callerName: {
    type: String,
    required: false
  },
  blacklisted: {
    type: String,
    required: true
  },
  blacklistedReason: {
    type: String,
    required: false
  },
  recordingURL: {
    type: String,
    required: false
  },
   callDuration: {
    type: String,
    required: false
  },
  createdOn: {
    type: Date,
    required: false,
  },
  transcribeText: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  poolNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoolNumber'
  }
});

// Create a Mongoose model from our schema
var Call = mongoose.model('Call', CallSchema);

// export model as our module interface
module.exports = Call;
