var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[0].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
        }
        var conFile = 'is not found';
        try{
            conFile = fs.readFileSync('.'+pathname,'utf-8');
        }catch (e){
        }
        res.writeHead(200,{'context-type':suffixMIME+';charset=utf-8'});
        res.end(conFile);
        return;
    }
    //API接口
    var customData=fs.readFileSync('./json/custom.json','utf-8');
    customData = JSON.parse(customData);
    customData=customData.length===0?'[]':customData;
    var result = {
        code:1,
        msg:'失败',
        data:null
    };
    var customId = query['id'];
    if (pathname==='/getList'){
        if (customData.length>0){
            result = {
                code:0,
                msg:'请求成功',
                data:customData
            }
        }
        res.writeHead(200,{'content-type':'application/json;chart=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/addInfo'){
        var str ='';
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
                msg:'添加成功'
            };
            res.writeHead(200,{'context-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));

        });
        return;
    }
    if (pathname==='/getInfo'){
        customData.forEach(function (item, index) {
            if (item['id']==customId){
                result = {
                    code:0,
                    msg:'获取成功',
                    data:customData[index]
                };
                return false
            }
        });
        res.writeHead(200,{'context-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/updateInfo'){
        str ='';
        req.on('data',function (chunk) {
            str+=chunk;
        });
        req.on('end',function () {
            data = JSON.parse(str);
            customData.forEach(function (item, index) {
                if (item['id']==data['id']){
                    customData[index]= data;
                    return false;
                }
            });
            fs.writeFileSync('./json/custom.json',JSON.stringify(customData),'utf-8');
            result = {
                code:0,
                msg:'添加成功'
            };
            res.writeHead(200,{'context-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));

        });
        return;
    }
    if (pathname==='/removeInfo'){
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
        res.writeHead(200,{'context-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
    }
});
server1.listen(8080,function () {
   console.log('8080 ok')
});

