/**
 * Created by hywilliam on 8/2/15.
 */
var express = require('express');
var path = require('path');
//var bodyParser = require('body-parser');
//var readPDF = require('server/file/readPDF');
var app = express();

var userDao = require('./server/db/userDao');

//var router = express.Router;

/* 视图模板配置 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/**
 * 中间件配置
 */
app.use(express.static(path.join(__dirname, '/public')));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

/**
 * 路由先写在这里，回来再拆分
 */
app.get('/', function (req, res) {
    res.render('index');
});

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

app.get('/query', function (req, res, next) {
    userDao.verifyByNamePassword(req, res, next);
});


/* 端口监听 */
app.listen(3000, function () {
    console.log("listening on 3000")
});
