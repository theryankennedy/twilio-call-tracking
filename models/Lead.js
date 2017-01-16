var mongoose = require('mongoose');

var LeadSchema = new mongoose.Schema({
  callerNumber: {
    type: String,
    required: true
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
  createdOn: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  qualified: {
    type: Boolean,
    required: false
  },
  revenue: {
    type:Number,
    required:false
  },
  callSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CallSource'
  },
  poolNumber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoolNumber'
  },
 adgroup: {
    type: String,
    required:false
  },
  keyword: {
    type: String,
    required:false
  }
});

// Create a Mongoose model from our schema
var Lead = mongoose.model('Lead', LeadSchema);

// export model as our module interface
module.exports = Lead;
