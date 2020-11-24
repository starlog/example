'use strict';
let async = require('async');
let myRedis = require('wavve-tool').interface.redisCache;
let myMongodb = require('wavve-tool').interface.mongodb;
let util2 = require('wavve-tool').util.util2;
let jsonpathmap = require('jsonpathmap').engine;

///////////////////////////////////////////////////////////////////////////////////////////////////
// 설정 데이타
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
// 응답포멧
///////////////////////////////////////////////////////////////////////////////////////////////////
const resultStructure = {
  programtitle: '$.programtitle',
  genre: '$.genre.text',
  contenttitle: '$.episodetitle'
};

const resultStructureMulti = {
  count: '#[*]',
  list: [
    {
      programtitle: '$[*].programtitle',
      genre: '$[*].genre.text',
      contenttitle: '$[*].episodetitle'
    }
  ]
};

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

  try
  {
    let contentid = args.contentid.value;

    let queryObject = {
      name: 'contents',
      db: 'vod',
      collection: 'supercontent',
      query: {contentid: contentid},
      sort: {},
      fields: {_id:0, programtitle: 1, genre: 1, episodetitle: 1},
      skip:0,
      limit:100,
      useRedis: true,
      RedisTtl: 10
    };

    let queryObjectProgramID = {
      name: 'contents',
      db: 'vod',
      collection: 'supercontent',
      query: {programid: contentid},
      sort: {},
      fields: {_id:0, programtitle: 1, genre: 1, episodetitle: 1},
      skip:0,
      limit:100,
      useRedis: true,
      RedisTtl: 10
    };

    // myMongodb.find(resultStructure, function(err, result){
    //   let resultData = jsonpathmap.jsonpathmap(resultStructure, result);
    //   res.end(JSON.stringify(resultData, null, 2));
    // });

    myMongodb.find(queryObjectProgramID, function(err, result){
      let resultData = jsonpathmap.jsonpathmap(resultStructureMulti, result);
      res.end(JSON.stringify(resultData, null, 2));
    });
  }
  catch(ex)
  {
    console.log('try-catch err='+ex);
  }
}
