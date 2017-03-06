var http = require('http'),
    url = require('url'),
    fs = require('fs');

var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),//true把问号传进来的值解析成键值对
        pathname = urlObj.pathname,
        query = urlObj.query;//--》存储的是客户端请求的URL地址中问号传参后面的信息（并且是以对象的键值对）
    var reg = /\.([0-9A-Za-z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = 'text/plain';
        switch (suffix) {
            case "HTML":
                suffixMIME = 'text/html';
                break;
            case "CSS":
                suffixMIME = 'text/css';
                break;
            case "JS":
                suffixMIME = 'text/javascript';
        }
        var conFile = 'file is not ';
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            res.writeHead(200, {"content-type": suffixMIME + ';charset=utf-8'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {"content-type": 'text/plain;charset=utf-8'});
            res.end(conFile);
        }
        return;
    }

    //->API数据接口的处理
    //获取所有的客户信息
    var con = null,
        result = null,
        customId = null,
        customPath = "./json/student.json";
    //首先我们把custom.json文件中的内容都获取到
    con = fs.readFileSync(customPath, 'utf-8');
    con.length === 0 ? con = '[]' : null;//为了防止custom.json中什么都没有，con是一个空字符串，我们使用JSON.parse时会报错，让其等于'[]';
    con = JSON.parse(con);
    //1）获取所有的客户的信息
    if (pathname === '/getList') {
        //开始按照API文档中规范准备给客户端 返回的数据
        result = {
            code: 1,
            msg: "没有任何的客户信息",
            data: null
        };
        if (con.length > 0) {
            result = {
                code: 0,
                msg: "成功",
                data: con
            };
        };
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));//返回客户端
        return;
    }
    //2）根据传递进来的客户ID获取某一个具体的客户信息
    if (pathname === '/getInfo') {
        //-》把客户端传递进来的ID获取到
        customId = query['id'];
        result = {
            code: 1,
            msg: "客户不存在",
            data: null
        };
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                result = {
                    code: 0,
                    msg: "成功",
                    data: con[i]
                };
                break;
            }
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));//返回客户端
        return;
    }
    //3）根据传递进来的客户ID删除这个客户
    if (pathname === '/removeInfo') {
        customId = query['id'];
        var flag = false;
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                con.splice(i, 1);
                flag = true;
                break;
            }
        }
        result = {
            code: 1,
            msg: "删除失败"
        };
        if (flag) {
            fs.writeFileSync(customPath, JSON.stringify(con), 'utf-8');
            result = {
                code: 0,
                msg: "删除成功"
            };
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));//返回客户端
        return;
    }
    //4)增加客户信息
    if (pathname === '/addInfo') {
        var str = '';
        //获取客户端通过请求主体传递进来的内容//客户端请求有两个事件，data是接受请求主体的内容，一点一点的接收。end是接收完毕
        req.on("data", function (chunk) {//异步编程
            str += chunk;
        });
        req.on("end", function () {
            //str = '{"name":"xxx","age":xx,"phone":"xxxxxx","address":"xxxxxxx"}'
            if (str.length === 0) {
                res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
                res.end(JSON.stringify({
                    code: 1,
                    msg: "增加失败，没有传递任何需要参加的增加信息"
                }));//返回客户端
                return;
            }
            var data = JSON.parse(str);
            //在现有的data中追加一个id;获取con中最后一项的ID，新的ID是在原有的基础上+1即可,如果之前一项都没有，我们这一项的ID就是1
            data['id'] = con.length == 0 ? 1 : parseFloat(con[con.length - 1]["id"] + 1);
            /* if(con.length==0){
             data['id']=1
             }else {
             data["id"]=parseFloat(con[con.length-1]["id"]+1);
             }*/
            con.push(data);
            fs.writeFileSync(customPath, JSON.stringify(con), 'utf-8');
            res.end(JSON.stringify({
                code: 0,
                msg: "增加成功"
            }));
        });
        return;
    }
    //5）修改客户信息
    if (pathname === '/updateInfo') {
        str = '';
        req.on('data', function (chunk) {
            str += chunk;
        });
        req.on('end', function () {
                if (str.length === 0) {
                    res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
                    res.end(JSON.stringify({
                        code: 1,
                        msg: "修改失败，没有传递任何需要参加的增加信息"
                    }));//返回客户端
                    return;
                }
                var flag = false,
                    data = JSON.parse(str);
                for (var i = 0; i < con.length; i++) {
                    if (con[i]['id'] == data['id']) {
                        con[i] = data;
                        flag = true;
                        break;
                    }
                }
                result = {
                    code: 1,
                    msg: "修改失败，客户不存在"
                };
                if (flag) {
                    fs.writeFileSync(customPath, JSON.stringify(con), 'utf-8');
                    result = {
                        code: 0,
                        msg: '修改成功'
                    };
                }
                res.end(JSON.stringify(result));
            }
        );
        return;
    }
    //如果请求的地址不是上述任何一个，则提示不存在即可
    res.writeHead(404, {'content-type': 'text/plain;charset=utf-8'});
    res.end('请求的数据接口不存在');

});
server1.listen(80, function () {
    console.log("server is success,listening on 80 port")
});

