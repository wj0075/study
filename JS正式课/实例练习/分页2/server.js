var http=require('http'),
    url=require('url'),
    fs=require('fs');
var server1 = http.createServer(function (req, res) {
    var objUrl = url.parse(req.url,true),
        pathname = objUrl.pathname,
        query = objUrl.query;
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)){
        var suffix = reg.exec(pathname)[1].toLowerCase(),
            suffixMIME = 'text/plain';
        switch (suffix){
            case 'html':
                suffixMIME = 'text/html';
                break;
            case 'css':
                suffixMIME = 'text/css';
                break;
            case 'js':
                suffixMIME='text/javascript';
                break
        }
        var conFile = 'not found';
        try{
            conFile = fs.readFileSync('.'+pathname,'utf-8');
        }catch (e){
        }
        res.writeHead(200,{'content-type':suffixMIME+';charset=utf-8'});
        res.end(conFile);
    }
    //API文档；
    var studentData = JSON.parse(fs.readFileSync('./json/student.json','utf-8'));
    studentData = studentData.length==0?'[]':studentData;
    var result = {
        code:1,
        msg:'失败',
        data:null
    };
    if (pathname==='/getList'){
        var pageNum = query['n'];
        var ary = [];
        for (var i =(pageNum-1)*10;i<=pageNum*10-1;i++){
            if (i>studentData.length-1){
                break;
            }
            ary.push(studentData[i])
        }
        result = {
            code:0,
            msg:'成功',
            totals:Math.ceil(studentData.length/10),
            data:ary
        };
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }
    if (pathname==='/getInfo'){
        var studentId = query['id'];
        studentData.forEach(function (item, index) {
            if (item['id']==studentId){
                result = {
                    code:0,
                    msg:'成功',
                    data:studentData[index]
                };
                return false;
            }
        });
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
        return;
    }

});
server1.listen(8080,function () {
    console.log('8080 ok')
});



