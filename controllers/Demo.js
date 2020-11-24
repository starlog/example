'use strict';

var url = require('url');

var Demo = require('./DemoService');

module.exports.testme = function testme (req, res, next) {
  Demo.testme(req.swagger.params, res, next);
};
