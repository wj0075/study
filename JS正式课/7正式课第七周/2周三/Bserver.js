//1.先引入node中的内置模块，以来执行I/O操作
var http= require('http'),
    url = require('url'),
    fs = require('fs');

//2.创建一个服务
var server1 = http.createServer(function(req,res){//函数中可以传入两个参数 一个请求request,一个响应response
    //这时需要获取到客户端发送的请求地址，并对其进行解析
    var urlObj = url.parse(req.url,true),//parse方法的作用,把一个URL中的每一部分进行解析
        pathname = urlObj.pathname,
        query = urlObj.query;
        //这时候就可以根据获取到的资源文件路径在服务器端找到对应的文件
    //兼容IE
    var reg =/\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        //根据获取到的文件的后缀名获取到当前文件的MIME类型
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = 'text/plain';
        switch (suffix){
            case "HTML":
                suffixMIME = 'text/html';
                break;
            case "CSS":
                suffixMIME = 'text/css';
                break;
            case "JS":
                suffixMIME = 'text/javascript';
                break;
            case "JSON":
                suffixMIME = 'application/json';
                break;
        }
        var conFile = 'file is not ';
        try {
            conFile = fs.readFileSync('.'+pathname,'utf-8');

        }catch (e){
        }
        res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});

        //服务器向客户端返回的也是字符串
        res.end(conFile)
    }

        //将服务器中的文件找到以字符串的形式存在变量中(读取出来的内容都是字符串格式的)

    //将找到的文件源代码返回给客户端

});
//3.给server1配置一个端口
server1.listen(83,function(){
    console.log('server is success,listing on 83 port')
});