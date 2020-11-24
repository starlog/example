'use strict';

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

