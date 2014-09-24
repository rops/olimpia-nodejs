'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Phase = require('./phase.model');


describe('Phases Tests Suite',function(){

  var seed = [{
        code : 'FASE1',
        description : 'Fase Uno',
        importCode : 'F1'
      },
      {
        code : 'FASE2',
        description : 'Fase Due',
        importCode : 'F2'
      }];



  beforeEach(function(done){
    Phase.find({}).remove(function() {
      Phase.create(seed);
      done();
    });
  });


  describe('GET /api/phases', function() {

    it('should respond with JSON array of all phases', function(done) {
      request(app)
        .get('/api/phases')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.an.Array.and.have.lengthOf(seed.length);
          var phases = _.map(res.body,function(phase){return _.omit(phase,['_id','__v'])});
          phases.should.eql(seed)
          done();
        });
    });
  });



  describe('GET /api/phases/:id', function() {
    var phase = seed[0];

    beforeEach(function(done){
      Phase.findOne({code:phase.code},function(err,art){
        if(err) return done(err);
        phase._id = art.id;
        phase.__v = art.__v;
        done();
      })
    });
    
    it('should respond with a single json phase', function(done) {
      request(app)
        .get('/api/phases/'+phase._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(phase)
          done();
        });
    });

  });

  describe('POST /api/phases',function(){
    var newPhase = {code : 'FASE3',description : 'Phase Tre',importCode : 'F3'}
    it('should create a new phase', function(done) {
      request(app)
        .post('/api/phases/')
        .send(newPhase)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          _.omit(res.body,['_id','__v']).should.eql(newPhase);
          Phase.find(function(err,phases){
            if(err) return done(err);
            phases.should.have.lengthOf(seed.length+1);
            done();
          })
        });
    });
  });

  describe('PUT/PATCH /api/phases/:id',function(){

    var phase = seed[0];

    beforeEach(function(done){
      Phase.findOne({code:phase.code},function(err,art){
        if(err) return done(err);
        phase._id = art.id;
        phase.__v = art.__v;
        phase.description += " EDITED";
        done();
      })
    });

    it('should update phase', function(done) {
      request(app)
        .patch('/api/phases/'+phase._id)
        .send(phase)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(phase)
          Phase.findById(phase._id,function(err,phase){
            if(err) return done(err);
            phase.should.be.eql(phase);
            done();
          })
        });
    });

  });


  describe('DELETE /api/phases/:id',function(){

    var phase = seed[0];

    beforeEach(function(done){
      Phase.findOne({code:phase.code},function(err,art){
        if(err) return done(err);
        phase._id = art.id;
        phase.__v = art.__v;
        done();
      })
    });

    it('should delete phase', function(done) {
      request(app)
        .delete('/api/phases/'+phase._id)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          Phase.findById(phase._id,function(err,phase){
            if(err) return done(err);
            should(phase).be.empty;
            Phase.find({},function(err,phases){
              if(err) return done(err);
              phases.should.have.lengthOf(seed.length-1);
              done();
            })
          })
        });
    });

  });

});