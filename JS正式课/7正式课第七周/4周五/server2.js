var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function(req,res){
    var urlObj = url.parse(req.url,true),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case "HTML":
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }
        var conFile = 'file is not found';
        try {
            conFile = fs.readFileSync('.'+pathname,'utf-8');
            res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
            res.end(conFile)
        }catch (e){
            res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
            res.end(conFile)
        }
    }
    //API接口
    var customData = fs.readFileSync('./json/student.json','utf-8');
        customData = JSON.parse(customData);
    var result = {
        code:1,
        msg:'失败'
    };
    var customId = query['id'];
    if(pathname==='/getAllList'){
      if (customData.length>0){
          result={
              code:0,
              msg:'成功',
              data:customData
          };
          res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
          res.end(JSON.stringify(result));
      }
        return;
    }
    if (pathname==='/getInfo'){
        customData.forEach(function(item,index){
            if (item['id']==customId){
                result = {
                    code:0,
                    mag:'成功',
                    data:item
                }
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/removeInfo'){
        customData.forEach(function(item,index){
            if (item['id']==customId){
                customData.splice(index,1);
                result = {
                    code:0,
                    msg:'删除成功'
                }
            }
        });
        fs.writeFileSync('./json/student.json',JSON.stringify(customData),'utf-8');
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/addInfo'){
        var str = '';
        req.on('data',function(chunk){
            str+=chunk;
        });
        req.on('end',function(){
            var data = JSON.parse(str);
            data['id']=customData.length==0?1:parseFloat(customData[customData.length-1]['id'])+1;
            customData.push(data);
            fs.writeFileSync('./json/student.json',JSON.stringify(customData),'utf-8')
            result={
                code:0,
                msg:'增加成功'
            };
            res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));
        });
        return;
    }
    if (pathname ==='/updateInfo'){
        str = '';
        req.on('data',function(chunk){
            str+=chunk;
        });
        req.on('end',function(){
           var data = JSON.parse(str);
            customData.forEach(function(item,index,input){
                if (item['id']==data['id']){
                   input[index]=data;
                    result={
                        code:0,
                        msg:'修改成功'
                    };
                    return false;
                }

            });
            /*for (var i=0;i<customData.length;i++){
                if (customData[i]['id']==data['id']){
                    customData[i]=data;
                    result={
                        code:0,
                        msg:'修改成功'
                    };
                    break;
                }
            }*/

            fs.writeFileSync('./json/student.json',JSON.stringify(customData),'utf-8');
            res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));
            return;
        })
    }
});
server1.listen(82,function(){
    console.log('82 ok');
});