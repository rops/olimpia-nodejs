'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OperatorSchema = new Schema({
  code: String,
  description: String,
  importCode : String
});

module.exports = mongoose.model('Operator', OperatorSchema);