/**
 * Created by hywilliam on 8/2/15.
 */

var express = require('express');
var test = require('./server/file/read_error_code_test');
var app = express();
var userDao = require('./server/db/userDao');

app.get('/', test.readErrorCode);

app.get('/query', function(req, res, next) {
    userDao.verifyByNamePassword(req, res, next);
});

app.listen(3000,function(){
    console.log("listening on 3000")
});

