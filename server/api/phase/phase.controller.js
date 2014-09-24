'use strict';

var _ = require('lodash');
var Phase = require('./phase.model');

// Get list of phases
exports.index = function(req, res) {
  Phase.find(function (err, phases) {
    if(err) { return handleError(res, err); }
    return res.json(200, phases);
  });
};

// Get a single phase
exports.show = function(req, res) {
  Phase.findById(req.params.id, function (err, phase) {
    if(err) { return handleError(res, err); }
    if(!phase) { return res.send(404); }
    return res.json(phase);
  });
};

// Creates a new phase in the DB.
exports.create = function(req, res) {
  Phase.create(req.body, function(err, phase) {
    if(err) { return handleError(res, err); }
    return res.json(201, phase);
  });
};

// Updates an existing phase in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Phase.findById(req.params.id, function (err, phase) {
    if (err) { return handleError(res, err); }
    if(!phase) { return res.send(404); }
    var updated = _.merge(phase, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, phase);
    });
  });
};

// Deletes a phase from the DB.
exports.destroy = function(req, res) {
  Phase.findById(req.params.id, function (err, phase) {
    if(err) { return handleError(res, err); }
    if(!phase) { return res.send(404); }
    phase.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}