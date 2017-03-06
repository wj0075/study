var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toLowerCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case "html":
                suffixMIME = 'text/html';
                break;
            case 'css':
                suffixMIME='text/css';
                break;
            case 'js':
                suffixMIME='text/javascript';
                break;
        }
        var conFile = 'not found';
        try{
            conFile = fs.readFileSync('.'+pathname,'utf-8');
        }catch (e){

        }
        res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
        res.end(conFile);
    }
    //API接口
    var customData = JSON.parse(fs.readFileSync('./json/custom.json','utf-8'));
    customData = customData.length>0?customData:'[]';
    var result = {
        code:1,
        msg:'失败'
    };
    var customId = query['id'];
    if (pathname ==='/getList'){
        if (customData.length>0){
            result = {
                code:0,
                msg:'成功',
                data:customData
            }
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/addInfo'){
        var str = '';
        req.on('data',function (chunk) {
            str+=chunk;
        });
        req.on('end',function () {
            var data = JSON.parse(str);
            data['id']=customData.length===0?1:parseFloat(customData[customData.length-1]['id'])+1;
            customData.push(data);
            fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
            result = {
                code:0,
                msg:'成功'
            };
                res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
                res.end(JSON.stringify(result));
        });
        return;
    }
    if (pathname==='/getInfo'){
        customData.forEach(function (item, index) {
            if (item['id']==customId){
                result={
                    code:0,
                    msg:'成功',
                    data:item
                };
                return false
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname ==='/updateInfo'){
        str = '';
        req.on('data',function (chunk) {
            str+=chunk;
        });
        req.on('end',function () {
           data = JSON.parse(str);
           customData.forEach(function (item, index) {
               if (item['id']==data['id']){
                   customData[index]=data;
                   return false;
               }
           });
            fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
            result = {
                code:0,
                msg:'成功'
            };
            res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));
        });
        return
    }
    if(pathname==='/removeInfo'){
        customData.forEach(function (item, index) {
            if (item['id']==customId){
                customData.splice(index,1);
                return false
            }
        });
        fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
        result = {
            code:0,
            msg:'删除成功'
        };
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
});
server1.listen(9090,function () {
   console.log('9090 ok')
});
