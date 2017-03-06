var http=require('http'),
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
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case  'CSS':
                suffixMIME = 'text/css';
                break;
            case  'JS':
                suffixMIME='text/javasript';
                break
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



    var con = fs.readFileSync('./json/student.json','utf-8');
        con = JSON.parse(con);
    var result = {
        code:0,
        msg:'失败'
    };

    if (pathname==='/getList'){
        result = {
            code:0,
            msg:'成功',
            data:con
        };
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
    }
    if (pathname==='/addInfo'){
        var str = '';
        req.on('data',function(chunk){
            str+=chunk;
        });
        req.on('end',function(){
            var data = JSON.parse(str);
            data['id']=con.length==0?1:parseFloat(con[con.length-1]['id'])+1;
            con.push(data);
            fs.writeFileSync('./json/student.json',JSON.stringify(con),'utf-8');
            res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify({
                code:0,
                msg:'成功'
            }));
        });
    }
    if (pathname==='/getInfo'){
        var customId = query['id'];
        con.forEach(function(item,index,input){
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
    }
    if (pathname==='/updateInfo'){
         str = '';
        req.on('data',function(chunk){
            str +=chunk;
        });
        req.on('end',function(){
             data = JSON.parse(str);
            con.forEach(function(item,index,input){
                if(item['id']==data['id']){
                    input[index]=data;
                    result={
                        code:0,
                        msg:'成功'
                    };
                    return false;
                }
            });
            fs.writeFileSync('./json/student.json',JSON.stringify(con),'utf-8');
            res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
            res.end(JSON.stringify(result));
        })
    }
    if (pathname==='/removeInfo'){
        customId=query['id'];
        con.forEach(function(item,index,input){
            if (item['id']==customId){
             input.splice(index,1);
                result={
                    code:0,
                    msg:'成功'
                };
                return false
            }
        });
        fs.writeFileSync('./json/student.json',JSON.stringify(con),'utf-8');
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
    }

});








server1.listen(8080,function(){
    console.log('8080 ok')
});


