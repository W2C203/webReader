var express = require('express');
var app = express.Router();
var usingmysql = require('../server/db/usingmysql');

app.get('/', function (req, res, next) {
    res.render('joeTest');
});
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

module.exports = app;