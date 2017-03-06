var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];
    var reg = /\.([0-9a-zA-Z]+)/;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/html';
        suffixMIME = suffix == 'CSS' ? 'text/css' : (suffix == 'JS' ? 'text/javascript' : 'text/html');
        try {
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf8;'});
            res.end(fs.readFileSync('.' + pathname, 'utf8'));
        } catch (e) {
            res.writeHead(404);
            res.end('file is not found!');
        }
    }
    var data = JSON.parse(fs.readFileSync('./json/students.json', 'utf8'));
    if (pathname == '/getList') {
        var ary = [],
            n = query['n'];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            if (i > data.length - 1) {
                break;
            }
            ary.push(data[i]);
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf8;'});
        res.end(JSON.stringify({
            code: 0,
            msg: '成功',
            total: Math.ceil(data.length / 10),
            data: ary
        }));
        return;
    }
    if (pathname == '/getInfo') {
        var studentID = query['id'],
            obj = {};
        for (i = 0; i < data.length; i++) {
            if (data[i].id == studentID) {
                obj = data[i];
                break;
            }
        }
        var result = {
            code: 1,
            msg: '失败',
            data: null
        };
        if (obj) {
            result = {
                code: 0,
                msg: '成功',
                data: obj
            }
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf8;'});
        res.end(JSON.stringify(result));
        return;
    }
    res.writeHead(404);
    res.end('api is not found!!!');
}).listen(8080, function () {
    console.log('server is sccuss,listening to 8080');
});
