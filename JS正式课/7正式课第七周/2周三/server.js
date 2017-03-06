let http = require('http'),
    url = require('url'),
    fs = require('fs');


let server1 = http.createServer(function (req, res) {
    //console.log(req.url)//存储的信息是：客户端请求资源文件的目录和名称以及问号传递过来的参数值，例如：‘/css/index/css?name = zf&age = 8’
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    //处理客户端静态资源文件的请求
    //1。接受客户端的请求，解析出请求资源文件的目录和名称
    //2。读取指定资源文件中的源代码（在读取的时候，如果文件不存在，服务就崩溃了，后面的请求无法处理。我们需要在找不到资源文件的时候做处理；不让它不崩溃，返回的结果为未找到即可）
    //3.把获取的源代码返回给客户端

    //->IE小朋友比较弱智，我们返回的都是字符串，谷歌自己会智能识别HTML还是CSS，而IE识别不了CSS，认为返回的是字符串，这样样式就无法渲染了
    //作为后台开发，我们在返回内容的时候，还需要告诉客户端的浏览器，我们返回的额内容是什么样的类型==》指定MIME类型。
    //MIME
    //HTML ->text/html
    //JS -->text/javascript
    //TXT -->text/plain
    //JSON -->application/json
    //PNG  -->image/png


    var reg = /\.([0-9a-zA-z]+)/i;
    if (reg.test(pathname)){//只有符合（。xxx）的才是资源文件，才会做处理
        //根据不同的后缀名获取到不同的MIME
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript'
        }
       var conFile = 'file is not found';
        try{
             conFile = fs.readFileSync('.'+pathname,'utf-8');
        }catch (e){
        }
        res.writeHead(200,{
            'content-type': suffixMIME+';charset=utf-8'//重写响应头信息；修改返回内容的MIME类型以及编码格式
        });
        res.end(conFile);//告诉客
    }
    /*if (pathname==='/temp.html'){
        var conFile = fs.readFileSync('./temp.html','utf-8')
    }*/
    /*res.write(conFile);//给客户端返回内容*/

});
server1.listen(80, function () {
    console.log("server is success,listening on 80 port");
});

