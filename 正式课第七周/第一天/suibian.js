/*var http = require('http');
 http.createServer();*/

var a = 12;
var b = 13;
a = a + b;
b = a - b;
a = a - b;
console.log(a, b);

var lessc = require('less');//->导入或者引入模块使用require
lessc.render();//->执行模块中提供的方法