var http=require('http'),
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
           case 'html':
               suffixMIME='text/html';
               break;
           case 'css':
               suffixMIME='text/css';
               break;
           case 'js':
               suffixMIME = 'text/javascript';
       }
       var conFile = 'not found';
       try{
           conFile = fs.readFileSync('.'+pathname,'utf-8');
           res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
           res.end(conFile);
       }catch (e){
       }

       return;
   }

   //API接口文档
    var con =JSON.parse( fs.readFileSync('./json/custom.json','utf-8'));
    con=con.length>0?con:'[]';
    var result = {
        code:1,
        msg:'失败'
    };
    var customId = query['id'];
    if (pathname==='/getList'){
        if (con.length>0){
            result = {
                code:0,
                msg:'成功',
                data:con
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
            if (data.length!==0){
                data['id']=con.length===0?1:parseFloat(con[con.length-1]['id'])+1;
                con.push(data);
                fs.writeFileSync('./json/custom.json',JSON.stringify(con),'utf-8');
                result={
                    code:0,
                    msg:'增加成功'
                };
                res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
                res.end(JSON.stringify(result));
            }
        });
        return;
    }
    if (pathname==='/getInfo'){
        con.forEach(function (item,index) {
            if (item['id']==customId){
                result={
                    code:0,
                    msg:'成功',
                    data:item
                };
                return false;
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/updateInfo'){
        str='';
        req.on('data',function (chunk) {
            str+=chunk;
        });
        req.on('end',function () {
            data=JSON.parse(str);
               con.forEach(function (item, index) {
                   if (item['id']==data['id']){
                       con[index]=data;
                       return false
                   }
               });
               fs.writeFileSync('./json/custom.json',JSON.stringify(con),'utf-8');
               result={
                   code:0,
                   msg:'修改成功'
               };
               res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
               res.end(JSON.stringify(result));


        });

        return;
    }
    if(pathname==='/removeInfo'){
        con.forEach(function (item, index) {
            if (item['id']==customId){
                con.splice(index,1);
                return false;
            }
        });
        fs.writeFileSync('./json/custom.json',JSON.stringify(con),'utf-8');
        result={
            code:0,
            msg:'删除成功'
        };
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));


    }

});

server1.listen(8080,function () {
    console.log('8080 ok')
});