/**
 * Created by hywilliam on 8/2/15.
 */

var express = require('express');
var test = require('./server/file/read_error_code_test');
var app = express();

app.get('/', test.readErrorCode);

app.listen(3000);

