/**
 * node核心模块
 */
var express = require('express');
var path = require('path');
var app = express();
/**
 * 我们的处理模块 依次是 主页 文档服务器相关 权限服务器相关
 */
var index = require('./routes/index');
var data = require('./routes/data');
var verify = require('./routes/verify');

/* 视图模板配置 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/**
 * 中间件配置
 */
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', index);
app.use('/data', data);
app.use('/verify', verify);

/**
 * 必须放在app.js的其他代码？ 应该没有把
 */
//无

/* 端口监听 */
app.listen(4000, function () {
    console.log("listening on 3000")
});
