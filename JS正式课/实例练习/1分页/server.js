let http = require('http'),
    url = require('url'),
    fs = require('fs');
let server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        var conFile = 'not found';
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8')
        } catch (e) {
        }
        res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8'});
        res.end(conFile);
    }
    //API接口文档中规定的数据请求方式
    var data = JSON.parse(fs.readFileSync('./json/student.json', 'utf-8'));
    var result = {
        code: 1,
        msg: '失败',
    };
    if (pathname === '/getList') {
        var n = query['n'],
            ary = [];
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            //通过规律计算出来的索引比最大的索引都大，直接跳出循环即可，不需要在存储了，说明它是最后一页了
            if (i > data.length - 1) {
                break;
            }
            ary.push(data[i])
        }
        result = {
            code: 0,
            msg: '成功',
            total: Math.ceil(data.length / 10),
            data: ary
        };
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname === '/getInfo') {
        var studentId = query['id'],
            obj = null;
        for (i = 0; i < data.length; i++) {
            if (data[i]['id'] == studentId) {
                obj = data[i];
                result = {
                    code: 0,
                    msg: '成功',
                    data: obj
                };
                break;
            }
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    //请求的端口不存在
    res.writeHead(404);
    res.end("request api url is not found!");

});
server1.listen(8080, function () {
    console.log('8080 ok')
});
