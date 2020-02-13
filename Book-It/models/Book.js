const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  age:{
    type: Number,
    required: true
  },
  sex:{
    type: String,
    required: true
  },
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
  time:{
    type: String,
    required: true
  },
  number:{
    type: String
  },
  pnr:{
    type: Number
  },
  class:{
    type: String
  },
  seat:{
    type: Number
  },
  user:{
    type: String,
    required: true
  },
  now:{
    type: Date,
    default: Date.now
  }
})

mongoose.model('book', BookSchema);