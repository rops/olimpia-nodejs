'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OperationSchema = new Schema({
  startTime : Date,
  stopTime : Date,
  note : String,
  operator : { type: Schema.Types.ObjectId, ref: 'Operator' },
  article : { type: Schema.Types.ObjectId, ref: 'Article' },
  phase : { type: Schema.Types.ObjectId, ref: 'Phase' }
});

module.exports = mongoose.model('Operation', OperationSchema);