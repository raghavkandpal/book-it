const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const FlightSchema = new Schema({
  from:{
    type: String,
    required: true
  },
  to:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  class:{
    type: String,
    required: true
  },
  capacity:{
    type: Number,
    required: true
  },
  time:{
    type: String,
    required: true
  },
  number:{
    type:String
  },
  now:{
    type: Date,
    default: Date.now
  }
})

mongoose.model('flight', FlightSchema);