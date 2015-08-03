/**
 * Created by joe on 15-8-1.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');
//直接进入index.html 参数 进行路由转换
var server = http.createServer(function (req, res) {
    var path = url.parse(req.url, true);
    //console.log('here1:' + JSON.stringify(path))
    if (path.pathname == '/') {
        res.writeHead(200, {"Content-Type": "text/html"});
        fs.createReadStream('frontstage/index.html').pipe(res);
    }
    var whatKind = path.pathname.match(/\.\w+$/);
//    console.log(whatKind);
//    console.log("fxck:"+whatKind)
    switch ('.' + whatKind) {
        case "..js":
            res.writeHead(200, {"Content-Type": "text/js"});
            fs.createReadStream('frontstage' + path.pathname).pipe(res);
            //console.log("inside1")
            break;
        case "..css":
            res.writeHead(200, {"Content-Type": "text/css"});
            fs.createReadStream('frontstage' + path.pathname).pipe(res);
            break;
        case "..txt":
            res.writeHead(200, {"Content-Type": "text/plain"});
            fs.createReadStream('.'+path.pathname).pipe(res);
            break;
    }




    console.log(path.pathname); //这句不要删掉 时刻知道页面的请求




})

server.listen(3000, 'localhost', function () {
    console.log('server listening on port 3000');
});

