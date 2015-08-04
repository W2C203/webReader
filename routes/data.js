var express = require('express');
var app = express.Router();

//readPDF的测试页
app.get('/pdf', function (req, res) {
    res.render('pdf_read_test');
});
app.param(function (name, fn) {
    if (fn instanceof RegExp) {
        return function (req, res, next, val) {
            var captures;
            if (captures = fn.exec(String(val))) {
                req.params[name] = captures;
                next();
            } else {
                next('route');
            }
        }
    }
});
app.param('pageId', /^\d+$/);
app.get('/pdf/:pageId', function (req, res) {
//    res.send('page' + req.param.);
});

module.exports = app;


