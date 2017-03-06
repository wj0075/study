function fn() {
    console.log('my name is b');
}

var a = require('./A');//->“./”指的是当前目录 “../”指的是上级目录 “/”指的是根目录
a.fn();
a.sum();//->a.sum is not a function 因为在A中我们不允许别人使用sum方法