var mongoose = require('mongoose');

var ProSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  specialty: {
    type: String,
    required: false
  }
});

// Create a Mongoose model from our schema
var Pro = mongoose.model('Pro', ProSchema);

// export model as our module interface
module.exports = Pro;
