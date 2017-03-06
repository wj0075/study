var http = require('http'),
    url = require('url'),
    fs = require('fs');
var bottleList = [];
var server2 = http.createServer((req, res)=> {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /^([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME='text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
        }
        var conFile = 'file is not found';
        try {
            conFile = fs.readFileSync('.'+pathname,'utf-8')
        }catch (e){
        }
        res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
        res.end(conFile);
    }
   /* //判断是否扔瓶子
    if (pathname==='/throwBottle'){
        //因为扔瓶子用的post方法，所以这里要用到data  end 事件
        var data = '';
        req.on('data',chunk=>data+=chunk);
        req.on('end',()=>{
            //接收完毕，把data存起来
            bottleList.push(data);
            //给浏览器反应
            res.end();
        });
        return;
    }
    //捡瓶子
    if (pathname==='/getBottle'){
        //获取随机索引
        var index = Math.floor(Math.random()*bottleList.length);
        var item = bottleList[index];
        if (item===undefined){
            res.writeHead(400);
            res.end();
        }else {
            res.writeHead(200);
            res.end(item);
        }
    }*/
});
server2.listen(8181, function () {
    console.log`8181 ok`
});
