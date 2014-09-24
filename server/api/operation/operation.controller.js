'use strict';

var _ = require('lodash');
var Operation = require('./operation.model');

// Get list of operations
exports.index = function(req, res) {
  Operation.find().populate('operator phase article').exec(function (err, operations) {
    if(err) { return handleError(res, err); }
    return res.json(200, operations);
  });
};

// Get a single operation
exports.show = function(req, res) {
  Operation.findById(req.params.id, function (err, operation) {
    if(err) { return handleError(res, err); }
    if(!operation) { return res.send(404); }
    return res.json(operation);
  });
};

// Creates a new operation in the DB.
exports.create = function(req, res) {
  Operation.create(req.body, function(err, operation) {
    if(err) { return handleError(res, err); }
    return res.json(201, operation);
  });
};

// Updates an existing operation in the DB. Can only update note and stoptime
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if(req.body.article) { delete req.body.article; }
  if(req.body.phase) { delete req.body.phase; }
  if(req.body.operator) { delete req.body.operator; }
  if(req.body.startTime) { delete req.body.startTime; }

  Operation.findById(req.params.id, function (err, operation) {
    if (err) { return handleError(res, err); }
    if(!operation) { return res.send(404); }
    var updated = _.merge(operation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, operation);
    });
  });
};

// Deletes a operation from the DB.
exports.destroy = function(req, res) {
  Operation.findById(req.params.id, function (err, operation) {
    if(err) { return handleError(res, err); }
    if(!operation) { return res.send(404); }
    operation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}