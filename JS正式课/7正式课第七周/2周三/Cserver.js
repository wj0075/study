var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function(req,res){
    //获取客户端请求的url地址，这时我们需要地址中的资源文件目录；
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,//资源文件目录
        query = urlObj.query;

    /*if (pathname==='/index.html'){//判断资源目录是不是要找的
        var conFile = fs.readFileSync('./index.html','utf-8');//然后服务器端的获取到客户端想要获取的文件。
    }
    if(pathname==='/css/index.css'){
        conFile = fs.readFileSync('./css/index.css','utf-8');
    }*/

    //不可能，有一次客户端请求就要写一个判断来去获取后台的文件
    //但是在IE中某些浏览器不认识 返回的字符串，所以就用到了MIME
   /* var reg =/\.([0-9a-zA-Z]+)/i;//文件扩展名
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = 'text/plain';
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
*/
        var conFile = 'is not file';
        try {//在报错的时候，用异常处理机制来处理报错。
            conFile = fs.readFileSync('.'+pathname,'utf-8');
        }catch (e){
        };

        res.writeHead(200,{'content-type': 'text/html;charset=utf-8'});


        res.end(conFile);//然后返回给客户端

   // }

});

server1.listen(81,function(){
    console.log('server is success,listening on 81 port');
});

