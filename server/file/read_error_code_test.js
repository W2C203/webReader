/**
 * Created by hywilliam on 8/2/15.
 */

var fs = require('fs');
var Iconv = require('iconv').Iconv;
var assert = require('assert');
var jsonStr;

fs.readFile('./data/errorcode.json', function (err, data) {
//    jsonStr = typeof data;//obj
    var iconv = new Iconv('GBK', 'utf-8');
    var buf= iconv.convert(JSON.stringify(data));
//    jsonStr = buf.toString('utf-8');
    jsonStr = buf;
    console.log(Buffer.isBuffer(jsonStr));
});

function readErrorCode(req, res) {
//    res.send('hello');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(jsonStr);
    res.end();
}

exports.readErrorCode = readErrorCode;