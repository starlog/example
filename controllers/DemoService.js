'use strict';
let async = require('async');
let myRedis = require('wavve-tool').interface.redisCache;
let myMongodb = require('wavve-tool').interface.mongodb;
let util2 = require('wavve-tool').util.util2;
let jsonpathmap = require('jsonpathmap').engine;

///////////////////////////////////////////////////////////////////////////////////////////////////
const redisConnections = {
  sentinels: [
    {host: 'redis-common-01.local.wavve.com', port: 26379},
    {host: 'redis-common-02.local.wavve.com', port: 26379},
    {host: 'redis-common-03.local.wavve.com', port: 26379}
  ],
  name: 'common-redis-sentinel'
};
const mongoConnections = [
  {
    name: 'contents',
    url: 'mongodb://'
        + 'mongo-contents1-01.local.wavve.com:27017,'
        + 'mongo-contents1-02.local.wavve.com:27017,'
        + 'mongo-contents1-03.local.wavve.com:27017,'
        + 'mongo-contents1-04.local.wavve.com:27017,'
        + 'mongo-contents1-05.local.wavve.com:27017,'
        + 'mongo-contents1-06.local.wavve.com:27017,'
        + 'mongo-contents1-07.local.wavve.com:27017,'
        + 'mongo-contents1-08.local.wavve.com:27017,'
        + 'mongo-contents1-09.local.wavve.com:27017,'
        + 'mongo-contents1-10.local.wavve.com:27017,'
        + 'mongo-contents1-11.local.wavve.com:27017,'
        + 'mongo-contents1-12.local.wavve.com:27017,'
        + 'mongo-contents1-13.local.wavve.com:27017,'
        + '?replicaSet=wavveContents1RS0&readPreference=secondaryPreferred',
    options: {
      poolSize: 5,
      connectTimeoutMS: 2000,
      useNewUrlParser: true,
      useUnifiedTopology: true // 사용하면 에러발생
    },
    useRedis: true,
    RedisTtl: 60
  }
];
///////////////////////////////////////////////////////////////////////////////////////////////////
exports.init = function(callback)
{
  util2.setLogLevel();

  async.series([
      async.apply(myRedis.init,redisConnections.sentinels, redisConnections.name),
      async.apply(myMongodb.init, mongoConnections)
  ], function(err){
    callback(err);
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////
exports.testme = function(args, res, next) {
  /**
   * Test Application
   * Just sample application
   *
   * contentid String 검색하려는 contentid
   * returns testme
   **/
  var examples = {};
  examples['application/json'] = {
  "programtitle" : "프로그램 제목",
  "genre" : "장르",
  "contenttitle" : "회차 제목"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

