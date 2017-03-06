var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function (request, response) {
    //console.log(request.url);//->存储的信息是：客户端请求资源文件的目录和名称以及问号传递过来的参数值,例如:'/css/index.css?name=zf&age=8'
    var urlObj = url.parse(request.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;


    if (pathname === '/temp.html') {
        var conFile = fs.readFileSync('./temp.html', 'utf-8');
        response.end(conFile);
    }
    if (pathname === '/css/temp.css') {
        conFile = fs.readFileSync('./css/temp.css', 'utf-8');
        response.end(conFile);
    }

    /*response.write(conFile);//->给客户端返回内容
     response.write('');
     response.end();//->告诉客户端结束返回了*/
});

server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});