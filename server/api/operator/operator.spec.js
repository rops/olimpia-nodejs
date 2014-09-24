'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Operator = require('./operator.model');

describe('Operators Tests Suite',function(){

  var seed = [{
        code : 'OP1',
        description : 'Operator Uno',
        importCode : 'O1',
      },
      {
        code : 'OP1',
        description : 'Operator Uno',
        importCode : 'O1',
      }]



  beforeEach(function(done){
    Operator.find({}).remove(function() {
      Operator.create(seed);
      done();
    });
  });


  describe('GET /api/operators', function() {

    it('should respond with JSON array of all operators', function(done) {
      request(app)
        .get('/api/operators')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.an.Array.and.have.lengthOf(seed.length);
          var operators = _.map(res.body,function(operator){return _.omit(operator,['_id','__v'])});
          operators.should.eql(seed)
          done();
        });
    });
  });



  describe('GET /api/operators/:id', function() {
    var operator = seed[0];

    beforeEach(function(done){
      Operator.findOne({code:operator.code},function(err,art){
        if(err) return done(err);
        operator._id = art.id;
        operator.__v = art.__v;
        done();
      })
    });
    
    it('should respond with a single json operator', function(done) {
      request(app)
        .get('/api/operators/'+operator._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(operator)
          done();
        });
    });

  });

  describe('POST /api/operators',function(){
    var newOperator = {code : 'OP3',description : 'Operator Tre',importCode : 'O3'}
    it('should create a new operator', function(done) {
      request(app)
        .post('/api/operators/')
        .send(newOperator)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          _.omit(res.body,['_id','__v']).should.eql(newOperator);
          Operator.find(function(err,operators){
            if(err) return done(err);
            operators.should.have.lengthOf(seed.length+1);
            done();
          })
        });
    });
  });

  describe('PUT/PATCH /api/operators/:id',function(){

    var operator = seed[0];

    beforeEach(function(done){
      Operator.findOne({code:operator.code},function(err,art){
        if(err) return done(err);
        operator._id = art.id;
        operator.__v = art.__v;
        operator.description += " EDITED";
        done();
      })
    });

    it('should update operator', function(done) {
      request(app)
        .patch('/api/operators/'+operator._id)
        .send(operator)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(operator)
          Operator.findById(operator._id,function(err,operator){
            if(err) return done(err);
            operator.should.be.eql(operator);
            done();
          })
        });
    });

  });


  describe('DELETE /api/operators/:id',function(){

    var operator = seed[0];

    beforeEach(function(done){
      Operator.findOne({code:operator.code},function(err,art){
        if(err) return done(err);
        operator._id = art.id;
        operator.__v = art.__v;
        done();
      })
    });

    it('should delete operator', function(done) {
      request(app)
        .delete('/api/operators/'+operator._id)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          Operator.findById(operator._id,function(err,operator){
            if(err) return done(err);
            should(operator).be.empty;
            Operator.find({},function(err,operators){
              if(err) return done(err);
              operators.should.have.lengthOf(seed.length-1);
              done();
            })
          })
        });
    });

  });

});