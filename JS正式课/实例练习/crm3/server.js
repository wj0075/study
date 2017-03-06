let fs = require('fs');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
function readFile(callback) {
    fs.readFile('./json/custom.json','utf8',function (err, data) {
        if (err || data==''){
            callback([])
        }else {
            callback(JSON.parse(data))
        }
    })
}
function writeFile(data, callback) {
    fs.writeFile('./json/custom.json',JSON.stringify(data),callback)
}
app.get('/',function (req, res) {
   res.sendFile(path.resolve('index.html'))
});
let result = {
    code: 1,
    msg: '失败',
    data: null
};
app.get('/getList',function (req, res) {
    readFile(function (data) {
      if (data){
        result = {
            code:0,
            msg:'成功',
            data:data
        };
       res.send(result)
      }
    });
});
app.post('/addInfo',function (req, res) {
    let custom = req.body;
    readFile(function (data) {
        if (data){
            custom['id']=data.length==0?1:parseFloat(data[data.length-1]['id'])+1;
            data.push(custom);
            writeFile(data,function () {
                res.send({
                    code:0,
                    msg:'增加成功'
                })
            });
        }
    })
});
app.delete('/removeInfo',function (req, res) {
   let customId = req.query.id;
   readFile(function (data) {
       data = data.filter(function (item) {
            return item.id!=customId
       });
       writeFile(data,function () {
           res.send({
               code:0,
               msg:'删除成功'
           })
       })
   })
});
app.get('/getInfo',function (req,res) {
   let customId = req.query.id;
    readFile(function (data) {
        let result = data.find(function (item) {
            return item.id==customId;
        });
        res.send({
            code:0,
            msg:'成功',
            data:result
        })
    })
});
app.put('/updateInfo',function (req, res) {
    let custom = req.body;
   readFile(function (data) {
       data = data.map(function (item) {
           if (item.id==custom.id){
               return custom
           }
           return item;
       });
       writeFile(data,function () {
           res.send({
               code:0,
               msg:'添加成功'
           })
       })
   })
});
app.listen(9090);
