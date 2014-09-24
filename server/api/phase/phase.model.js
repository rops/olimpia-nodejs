'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhaseSchema = new Schema({
  code: String,
  description: String,
  importCode : String
});

module.exports = mongoose.model('Phase', PhaseSchema);