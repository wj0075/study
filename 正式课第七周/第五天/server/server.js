/**
 * Created by zhufengpeixun on 2016/12/11.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
// 将浏览器发送的请求参数，格式化为对象
var querystring = require('querystring');
// 文件路径解析
var path = require('path');
// 存储漂流瓶
var bottleList = [];
// 创建服务器
var server = http.createServer((req, res) => {
    // 把url解析为url对象
    let urlObj = url.parse(req.url, true);
    // 判断pathname是否为扔瓶子
    if (urlObj.pathname === '/throwBottle') {
        var data = '';
        // 因为扔瓶子使用的是post方法，所以这里需要使用data、end事件
        req.on('data', chunk=> data += chunk);
        req.on('end', ()=> {
            // 接收完毕，需要把data存起来
            bottleList.push(data);
            // 接收完成之后 给浏览器响应
            res.end();
        });
    } else if (urlObj.pathname === '/getBottle') {
        //Math.round(Math.random()*bottleList.length-1)
        // 获取随机下标
        var index = Math.floor(Math.random() * bottleList.length);
        var item = bottleList[index];
        if (item === undefined) {
            res.writeHead(400);
            res.end();
        } else {
            res.writeHead(200);
            res.end(item);
        }
    } else if (urlObj.pathname === '/crossOrigin') {
        //res.end('hello cross origin');
        //res.end("var b='hello cross origin'");
        // ?v=d => {v:d}
        var key = urlObj.query.key; // => d
        if (key === undefined) {
            key = 'defaultValue';
        }
        //res.end('var ' + key + '="hello cross origin"');
        res.end(key + '("hello cross origin")');
        // => showData('hello cross origin')
    } else {
        // url中的pathname
        var filePath = urlObj.pathname.slice(1);
        // 解析bottle文件夹的绝对路径
        var myPath = path.resolve(__dirname, '../bottle');
        // 凭借bottle文件的绝对路径和url中的pathname，会得到一个最终的文件夹路径
        var realPath = path.join(myPath, filePath);
        //console.log(`filepath: ${filePath}`);
        //console.log(`myPath: ${myPath}`);
        //console.log(`realPath: ${realPath}`);
        // 判断文件是否存在
        fs.exists(realPath, isExists=> {
            if (isExists) {
                // 读取文件
                fs.readFile(realPath, 'utf-8', (err, data)=> {
                    // 读取过程中出错
                    if (err) {
                        res.writeHead(500);
                        res.end('server internal error');
                    } else {
                        res.writeHead(200);
                        res.end(data);
                    }
                });
            } else {
                // 文件不存在 则返回404
                res.writeHead(404);
                res.end('not found this file');
            }
        });

    }
});
server.listen(8080, '127.0.0.1', function () {
    console.log`server start completed`;
});
