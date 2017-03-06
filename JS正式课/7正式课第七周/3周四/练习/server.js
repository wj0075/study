var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function (req, res) {
        //静态文件的发布
        var urlObj = url.parse(req.url, true),
            pathname = urlObj.pathname,
            query = urlObj.query;
        var reg = /\.([0-9a-zA-Z]+)/i;
        if (reg.test(pathname)) {
            var suffix = reg.exec(pathname)[1].toUpperCase(),
                suffixMIME = 'text/plain';
            switch (suffix){
                case 'HTML':
                    suffixMIME='text/html';
                    break;
                case 'CSS':
                    suffixMIME="text/css";
                    break;
                case 'JS':
                    suffixMIME = 'text/javascript';
            }
            var conFile = 'file is no found';
            try {
                conFile = fs.readFileSync('.'+pathname,'utf-8');
                res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
                res.end('ok');
            }catch (e){
                res.writeHead(404,{'content-type':'text/plain;charset=utf-8'});
                res.end(conFile);
            }
            return;
        }

    //API数据接口的处理
    var con = null,//在服务器获取到的资源
        result = null,//返回给客户端的内容
        customId = null,//客户端传递来的id
        customPath = './json/student.json';//服务器中存储数据的路径
    //首先我们需要把数据都取出来
    con = fs.readFileSync(customPath,'utf-8');
    con.length==0?con='[]':null;
    //取出来的JSON格式的字符串，需要把它变成JSON格式的对象，以便后续的操作。
    con=JSON.parse(con);
        //1)获取所有客户的信息
    if(pathname==='/getList'){
        result = {
            code:1,
            msg:"没有任何客户信息",
            data:null
        };
        if (con.length>0){
            result = {
                code:0,
                msg:"成功",
                data:con
            };
        }
        //告诉头部信息为json格式的文件
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        //返回给客户端时需要转换成json格式的字符串
        res.end(JSON.stringify(result));
        return;
    }
    //2）获取具体的某一个客户的信息
    if(pathname==='/getInfo'){
        customId = query['id'];
        result = {
            code:1,
            msg:"客户不存在",
            data:null
        };
        //遍历整个json资源，找到id和客户端传进来一样的，并重新给result赋值，data赋值为id相同的这一项的内容
        for (var i=0;i<con.length;i++){
            if (con[i]['id']==customId){
                result = {
                    code:0,
                    msg:'成功',
                    data:con[i]
                };
                break;
            }
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    //3）删除客户信息
    if(pathname==='/removeInfo') {
        customId = query['id'];
        result = {
            code:1,
            msg:"删除失败"
        };
        var flag = false;
        for(var i=0;i<con.length;i++){
            if (con[i]['id']==customId){
                //这时删除的只是con这个数组中的内容，而实际的文件还没有删除
                con.splice(i,1);
                flag = true;
                break;
            }
        }
        if (flag) {
            //所以在这里重新把已经改变的在写进文件
            fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
            //返回给客户端的信息
            result = {
                code:0,
                msg : "删除成功"
            }
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    //4）增加客户信息
    if (pathname ==='/addInfo'){
        var str = '';
        //这是往服务器端增加内容，因此客户端用到了请求主体传递内容，这时要用到两个请求的事件来接收客户端传来的内容
        req.on('data',function(chunk){//因为这里传进来的内容是一点点的传进来的，不是一下子就传进来，而且传进来的内容是字符串，所以要用字符串拼接的方式来接收内容
            str+=chunk;
        });
        req.on('end',function(){//所有请求主体传递进来的内容接收完毕
            //如果什么都没有传，这时就要进行判断，并且传进来的是JSON格式的字符串
            if (str.length===0){
                res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
                res.end(JSON.stringify({
                    code:1,
                    msg:'增加失败'
                }));
                return;
            }
            var data = JSON.parse(str);
            //在现有的data中追加一个ID，先获取最后一个ID，新的ID是在原有的基础上+1,如果之前一项都没有，这时给ID赋值为1就好。
            data['id']=con.length==0?1:parseFloat(con[con.length-1]['id']+1);
            //把这一项添加到con中去
            con.push(data);
            fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
            res.end(JSON.parse({
                code:0,
                msg:'成功'
            }));
        });
        return
    }
    //5)修改客户信息
    if (pathname==='updateInfo'){
         str = '';
        req.on('data',function(chunk){
            str+=chunk;
        });
        req.on('end',function(){
            if (str.length===0){
                res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
                res.end(JSON.stringify({
                    code:1,
                    msg:'修改失败'
                }));
                return;
            };
            var data = JSON.parse(str),
                flag = false;
            for (var i=0;i<con.length;i++){
                if (con[i]['id']==data['id']){
                    con[i]=data;
                    flag = true;
                    break;
                }
            }
            result.msg = '修改失败，修改的客户不存在';
            if(flag){
                fs.writeFileSync(customPath,JSON.stringify(con),'utf-8');
                result = {
                    code:0,
                    msg:'修改成功'
                };

            }
            res.end(JSON.stringify(result))
        });
        return;
    }






    });
server1.listen(82, function () {
    console.log('ok')
});
