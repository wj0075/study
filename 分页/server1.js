var http = require('http'),
    fs = require('fs'),
    url = require('url');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];
    var reg = /\.([0-9a-zA-Z])/;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/html';
        suffixMIME = suffix == 'CSS' ? 'text/css' : (suffix == 'JS' ? 'text/javascript' : 'text/html');
        try {
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf8;'});
            res.end(fs.readFileSync('.' + pathname, 'utf8'));
        } catch (e) {
            res.writeHead(404);
            res.end('file is not found!!!');
        }
    }
    var data = JSON.parse(fs.readFileSync('./json/students.json', 'utf8'));
    if (pathname == '/getList') {
        var n = query['n'],
            ary = [];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            var obj = {};
            if (i > data.length - 1) {
                break;
            }
            obj = data[i];
            ary.push(obj);
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf8;'});
        res.end(
            JSON.stringify({
                code: 0,
                msg: '成功',
                total: Math.ceil(data.length / 10),
                data: ary
        }))
    }

}).listen(8000, function () {
    console.log('server is success,listening 8000')
});
