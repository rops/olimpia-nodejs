'use strict';

var _ = require('lodash');
var Operator = require('./operator.model');

// Get list of operators
exports.index = function(req, res) {
  Operator.find(function (err, operators) {
    if(err) { return handleError(res, err); }
    return res.json(200, operators);
  });
};

// Get a single operator
exports.show = function(req, res) {
  Operator.findById(req.params.id, function (err, operator) {
    if(err) { return handleError(res, err); }
    if(!operator) { return res.send(404); }
    return res.json(operator);
  });
};

// Creates a new operator in the DB.
exports.create = function(req, res) {
  Operator.create(req.body, function(err, operator) {
    if(err) { return handleError(res, err); }
    return res.json(201, operator);
  });
};

// Updates an existing operator in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Operator.findById(req.params.id, function (err, operator) {
    if (err) { return handleError(res, err); }
    if(!operator) { return res.send(404); }
    var updated = _.merge(operator, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, operator);
    });
  });
};

// Deletes a operator from the DB.
exports.destroy = function(req, res) {
  Operator.findById(req.params.id, function (err, operator) {
    if(err) { return handleError(res, err); }
    if(!operator) { return res.send(404); }
    operator.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}