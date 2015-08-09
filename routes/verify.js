var express = require('express');
var app = express.Router();
var usingmysql = require('../handlers/db/usingmysql');

/**
 * 响应登录
 */
app.post('/query', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.verifyByNamePassword(data, res, next);
    })
});
/**
 * 响应查询已购买书籍
 */
app.post('/queryBuy', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.queryBuy(data, res, next);
    })
});

app.post('/queryFile', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.queryFile(data, res, next);
    })
});

module.exports = app;