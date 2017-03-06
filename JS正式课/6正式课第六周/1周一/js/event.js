function bind(ele, type, fn) {
    if ('addEventListener' in window) {
        ele.addEventListener(type, fn, false);
        return;
    }
    //给fn化妆，把化妆前的照片贴在自己对应的脑门上
    var tmpFn = function () {
        fn.call(ele);
    };
    tmpFn.photo = fn;
    //首先判断该自定义属性之前是否存在，不存在就创建一个，由于要存储多个方法化妆后的结果，所以我们让其值是一个数组；
    if (!ele['myBind' + type]) {
        ele['myBind' + type] = [];
    }
    //-->解决重复问题：每一次自己在往自定义属性对应的容器中添加前，看以下之前是够已经有了，有的话就不用在重新的添加了，同理也不需要网事件池中存储了
    var ary = ele['myBind' + type];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === fn) {
            return;
        }
    }
    ary.push(tmpFn);
    ele.attachEvent('on' + type, tmpFn)
}
function unbind(ele, type, fn) {
    if ('removeEventListener' in window) {
        ele.removeEventListener(type, fn, false);
        return;
    }
    var ary = ele["myBind" + type];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === fn) {
            ary.splice(i, 1);//-->找到后，把自己存贮的容器中对应的移除掉
            ele.detachEvent('on' + type, cur);//--》在把事件池中也移除掉
            break;
        }
    }
    //拿fn到ele["myBind"]这里找化妆后的结果，找到之后在事件池中把换装后的结果移除事件池
}

//-->解决顺序问题：我们不用浏览器自带的事件池，而是自己模拟标准浏览器大的事件池实现；

function on(ele, type, fn) {//创建事件池，并且把需要给当前元素绑定的方法依次的增加到事件池中
    if (!ele["myEvent" + type]) {
        ele["myEvent" + type] = [];
    }
    var ary = ele["myEvent" + type];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur === fn) {
            return;
        }
    }
    ary.push(fn);
    //ele.addEventListener(type, run, false);//执行on的时候，我们给当前元素绑定了一个点击的行为，当点击的时候执行run方法：run方法中的this,是当前元素ele，并且
    bind(ele,type,run);
}
function off(ele, type, fn) {//在自己的事件池中把某一个方法移除
    var ary = ele["myBind" + type];
    for (var i=0;i<ary.length;i++){
        var cur = ary[i];
        if (cur ===fn){
            ary.splice(i,1);
            break;
        }
    }

}
function run(e) {//我们只给当前元素的点击行为绑定一个方法run;当触发点击的时候执行的是run方法，我们在run方法中根据自己存储的方法顺序分别在把这些方法执行。
    //获取自己事件池中绑定的那些方法，并且让这些方法依次的执行
    e = window.event;
    var target = e.target ? true : false;
    if (!target) {
        e.target = e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        }
    }
    var ary = this["myBind" + e.type];
    for (var i = 0; i < ary.length; i++) {
        var tempFn = ary[i];
        tempFn.call(this, e)
    }
}