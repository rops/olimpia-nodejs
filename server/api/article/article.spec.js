'use strict';

var _ = require('lodash');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Article = require('./article.model');


describe('Articles Tests Suite',function(){

  var seed = [{
        code : 'ART1',
        description : 'Articolo Uno',
        importCode : 'A1',
        enabled : false
      },
      {
        code : 'ART1',
        description : 'Articolo Uno',
        importCode : 'A1',
        enabled : false
      }]



  beforeEach(function(done){
    Article.find({}).remove(function() {
      Article.create(seed);
      done();
    });
  });


  describe('GET /api/articles', function() {

    it('should respond with JSON array of all articles', function(done) {
      request(app)
        .get('/api/articles')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.an.Array.and.have.lengthOf(seed.length);
          var articles = _.map(res.body,function(article){return _.omit(article,['_id','__v'])});
          articles.should.eql(seed)
          done();
        });
    });
  });



  describe('GET /api/articles/:id', function() {
    var article = seed[0];

    beforeEach(function(done){
      Article.findOne({code:article.code},function(err,art){
        if(err) return done(err);
        article._id = art.id;
        article.__v = art.__v;
        done();
      })
    });
    
    it('should respond with a single json article', function(done) {
      request(app)
        .get('/api/articles/'+article._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(article)
          done();
        });
    });

  });

  describe('POST /api/articles',function(){
    var newArticle = {code : 'ART3',description : 'Articolo Tre',importCode : 'A3',enabled:false}
    it('should create a new article', function(done) {
      request(app)
        .post('/api/articles/')
        .send(newArticle)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          _.omit(res.body,['_id','__v']).should.eql(newArticle);
          Article.find(function(err,articles){
            if(err) return done(err);
            articles.should.have.lengthOf(seed.length+1);
            done();
          })
        });
    });
  });

  describe('PUT/PATCH /api/articles/:id',function(){

    var article = seed[0];

    beforeEach(function(done){
      Article.findOne({code:article.code},function(err,art){
        if(err) return done(err);
        article._id = art.id;
        article.__v = art.__v;
        article.description += " EDITED";
        done();
      })
    });

    it('should update article', function(done) {
      request(app)
        .patch('/api/articles/'+article._id)
        .send(article)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.eql(article)
          Article.findById(article._id,function(err,article){
            if(err) return done(err);
            article.should.be.eql(article);
            done();
          })
        });
    });

  });


  describe('DELETE /api/articles/:id',function(){

    var article = seed[0];

    beforeEach(function(done){
      Article.findOne({code:article.code},function(err,art){
        if(err) return done(err);
        article._id = art.id;
        article.__v = art.__v;
        done();
      })
    });

    it('should delete article', function(done) {
      request(app)
        .delete('/api/articles/'+article._id)
        .expect(204)
        .end(function(err, res) {
          if (err) return done(err);
          Article.findById(article._id,function(err,article){
            if(err) return done(err);
            should(article).be.empty;
            Article.find({},function(err,articles){
              if(err) return done(err);
              articles.should.have.lengthOf(seed.length-1);
              done();
            })
          })
        });
    });

  });

  describe('PUT/PATCH /api/articles/:id/enable',function(){

    var article = seed[0];

    beforeEach(function(done){
      Article.findOne({code:article.code},function(err,art){
        if(err) return done(err);
        article._id = art.id;
        article.__v = art.__v;
        article.enabled = true;

        art.enabled = false;
        art.save(function(err,art){
          if(err) done(err);
          done();  
        });
      })
    });

    it('should enable article', function(done) {
      request(app)
        .patch('/api/articles/'+article._id+'/enable')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.eql(article)
          Article.findById(article._id,function(err,art){
            if(err) return done(err);
            art.enabled.should.be.ok;
            done();
          })
        });
    });

  });


  describe('PUT/PATCH /api/articles/:id/disable',function(){

    var article = seed[0];

    beforeEach(function(done){
      Article.findOne({code:article.code},function(err,art){
        if(err) return done(err);
        article._id = art.id;
        article.__v = art.__v;
        article.enabled = false;

        art.enabled = true;
        art.save(function(err,art){
          if(err) done(err);
          done();  
        });
      })
    });

    it('should disable article', function(done) {
      request(app)
        .patch('/api/articles/'+article._id+'/disable')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.eql(article)
          Article.findById(article._id,function(err,art){
            if(err) return done(err);
            art.enabled.should.be.false;
            done();
          })
        });
    });

  });

});





