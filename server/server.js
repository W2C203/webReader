/**
 *
 * Created by hywilliam on 8/1/15.
 */
var http = require('http');
var fs = require('fs');
var url = require('url');

module.exports.start = function () {
    var server = http.createServer(function (req, res) {
        var urlParsed = url.parse(req.url, true);
        var pathname = urlParsed.pathname;
        var ext = pathname.match(/\.[^.]+|$/)[0];//取得后缀名
//        console.log(ext);
        switch (ext) {
            case '.css':
            case '.js':
//                console.log(req.url)
                fs.readFile('./www' + pathname, 'utf-8', function (err, data) {
                    if (err) throw err;
                    res.writeHead(200, {
                        'Content-Type': {
                            '.css': 'text/css',
                            '.js' : 'text/javascript'
                        }[ext]
                    });
                    res.write(data);
                    res.end();
//                    console.log(1)
                });
                break;
            default :
                fs.readFile('./www/reader.html', 'utf-8', function (err, data) {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                });
        }
//    if (pathname.match(/\/data\//)) {
////        console.log(1)
////        fs.createReadStream('../data/txt/p01.txt').pipe(res);
//        fs.readFile('../data/txt/p01.txt', function (err, data) {
//            res.writeHead(200, {'Content-Type': 'text/plain'});
//            res.write(data);
//            res.end();
//        });
//    }
    });

    server.listen(1337, '127.0.0.1');
    console.log('server start on 127.0.0.1:1337');
};