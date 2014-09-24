'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  code: String,
  description: String,
  importCode : String,
  enabled : Boolean
});

module.exports = mongoose.model('Article', ArticleSchema);