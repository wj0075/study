/**
 * Created by wj007 on 2016/12/6.
 */
var http = require('http'),
    url = require('url'),
    fs = require('fs');



//1.创建一个服务
var server1 = http.createServer(function(req,res){
    //解析客户端请求地址中的文件的目录名称以及传递给当前服务器的数据内容
    var urlObj = url.parse(req.url,true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];
    //处理静态资源文件的请求（HTML.CSS.JS）


    try {//如果的客户端请求的资源文件不存在，我们不加try catch  服务会终止，所以用它捕获异常，这样即使不存在，也不会报错
        var con = fs.readFileSync("."+pathname,"utf-8");
        res.end(con);
    }catch (e){
        res.end('request file is not find')
    }

    /*if (pathname==="/index.html"){
        var con = fs.readFileSync("./index.html","utf-8");
        res.end(con);
        return;
    }
    if (pathname==='/css/tab.css'){
        con = fs.readFileSync("./css/tab.css","utf-8");
        res.end(con);
        return;
    }
    if (pathname==='/js/tab.js'){
        con = fs.readFileSync("./js/tab.js","utf-8");
        res.end(con);
        return;
    }
*/
});
//2.我i当前的这个服务配置端口
server1.listen(12,function(){
    console.log('buhaowan')
})
