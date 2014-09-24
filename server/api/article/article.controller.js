'use strict';

var _ = require('lodash');
var Article = require('./article.model');
var Operation = require('../operation/operation.model');

// Get list of articles
exports.index = function(req, res) {
  Article.find(function (err, articles) {
    if(err) { return handleError(res, err); }
    return res.json(200, articles);
  });
};

// Get a single article
exports.show = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    return res.json(article);
  });
};

function buildReport(theArticle,res){
  var report = {article:theArticle};
  Operation
    .where({article:theArticle._id})
    .where('stopTime').ne(null)
    .populate('phase')
    .exec(function(err,operations){
      if(err) { return handleError(res, err); }
      if(!operations) { return res.send(404); }
      var phases = {};
      _.forEach(operations,function(op){
        var phase = op.phase;
        phases[phase._id] = phases[phase._id] || _.assign({operations:[]},_.pick(phase,['_id','code','description','importCode']));
        // phases[phase._id].operations = phases[phase._id].operations || [];
        phases[phase._id].operations.push(op);
      });
      report.phases = _.values(phases);
      return res.json(report);
    });
}

// Get an article report
exports.report = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    buildReport(article,res);
  });
};

// Creates a new article in the DB.
exports.create = function(req, res) {
  req.body.enabled = false;
  Article.create(req.body, function(err, article) {
    if(err) { return handleError(res, err); }
    return res.json(201, article);
  });
};

// Updates an existing article in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Article.findById(req.params.id, function (err, article) {
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    var updated = _.merge(article, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, article);
    });
  });
};

// Deletes a article from the DB.
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function (err, article) {
    if(err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    article.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


// Enable Article
exports.enable = function(req, res) {
  Article.findByIdAndUpdate(req.params.id,{enabled:true},function(err,article){
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    return res.json(200, article);
  });
};

// Disable Article
exports.disable = function(req, res) {
  Article.findByIdAndUpdate(req.params.id,{enabled:false},function(err,article){
    if (err) { return handleError(res, err); }
    if(!article) { return res.send(404); }
    return res.json(200, article);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}