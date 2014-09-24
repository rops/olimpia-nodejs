/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Article = require('../api/article/article.model');
var Operator = require('../api/operator/operator.model');
var Phase = require('../api/phase/phase.model');
var Operation = require('../api/operation/operation.model');
var Q = require('q');
var _ = require('lodash')

var queue = [],
   phases = [],
   operators = [],
   articles = [];

queue.push(Article.find({}).remove(function() {
  Article.create({
    code : 'ART1',
    description : 'Articolo Uno',
    importCode : 'A1',
    enabled : false
  }, {
    code : 'ART2',
    description : 'Articolo Due',
    importCode : 'A2',
    enabled : false
    
  }, {
    code : 'ART3',
    description : 'Articolo Tre',
    importCode : 'A4',
    enabled : false
    
  },  {
    code : 'ART4',
    description : 'Articolo Quattro',
    importCode : 'A4',
    enabled : false
    
  },{
    code : 'ART5',
    description : 'Articolo Cinque',
    importCode : 'A5',
    enabled : false
  },function(){
    articles = _.values(arguments).slice(1);
  });
}));


queue.push(Operator.find({}).remove(function() {
  Operator.create({
    code : 'OPE1',
    description : 'Operatore Uno',
    importCode : 'OP1',
  }, {
    code : 'OPE2',
    description : 'Operatore Due',
    importCode : 'OP2',
    
  }, {
    code : 'OPE3',
    description : 'Operatore Tre',
    importCode : 'OP4',
    
  },  {
    code : 'OPE4',
    description : 'Operatore Quattro',
    importCode : 'OP4',
    
  },{
    code : 'OPE5',
    description : 'Operatore Cinque',
    importCode : 'OP5',
  },function(){
    operators = _.values(arguments).slice(1);
  });
}));


queue.push(Phase.find({}).remove(function() {
  Phase.create({
    code : 'FASE1',
    description : 'Fase Uno',
    importCode : 'F1',
  }, {
    code : 'FASE2',
    description : 'Fase Due',
    importCode : 'F2',
    
  }, {
    code : 'FASE3',
    description : 'Fase Tre',
    importCode : 'F4',
    
  },  {
    code : 'FASE4',
    description : 'Fase Quattro',
    importCode : 'F4',
    
  },{
    code : 'FASE5',
    description : 'Fase Cinque',
    importCode : 'F5',
  },function(){
    phases = _.values(arguments).slice(1);
  });
}));

Q.all(queue).then(function(){
  Operation.find({}).remove(function(){
  
    Operation.create({
      startTime : new Date("09/22/2014 10:00:00"),
      stopTime : new Date("09/22/2014 10:05:00"),
      note : "ope1",
      operator: operators[_.random(operators.length)-1],
      phase: phases[_.random(phases.length)-1],
      article: articles[_.random(articles.length)-1]
    },
    {
      startTime : new Date("09/22/2014 11:00:00"),
      stopTime : new Date("09/22/2014 11:05:00"),
      note : "ope2",
      operator: operators[_.random(operators.length)-1],
      phase: phases[_.random(phases.length)-1],
      article: articles[_.random(articles.length)-1]
    })
  });
})