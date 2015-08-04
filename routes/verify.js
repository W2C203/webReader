var express = require('express');
var app = express.Router();
var usingmysql = require('../server/db/usingmysql');

app.post('/query', function (req, res, next) {
    req.on('data', function (data) {
        usingmysql.verifyByNamePassword(data, res, next);
    })
});
app.get('/123', function (req, res, next) {
    res.render('joeTest');
});

module.exports = app;