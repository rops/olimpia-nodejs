'use strict';

var express = require('express');
var controller = require('./article.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/report', controller.report);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.put('/:id/enable',controller.enable)
router.patch('/:id/enable',controller.enable)
router.put('/:id/disable',controller.disable)
router.patch('/:id/disable',controller.disable)

module.exports = router;