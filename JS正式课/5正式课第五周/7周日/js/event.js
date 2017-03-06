function bind(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
    } else {
        var tmpFn = function () {
            fn.call(ele)
        };
        tmpFn.name = fn;
        if (!ele[type + 'aEvent']) {
            ele[type + 'aEvent'] = [];
        }
        var a = ele[type + 'aEvent'];
        console.log(a);
        for (var i = 0; i < a.length; i++) {
            if (a[i].name == fn){

                return;
            }
        }
        a.push[tmpFn];
        ele.attachEvent('on' + type, tmpFn)
    }
}
function unbind(ele, type, fn) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fn, false)
    }
    var a = ele[type + 'aEvent'];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].name == fn) {
                ele.detachEvent('on' + type, fn);
                a[i] = null;
            }
        }
    }
}
function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn, false);
    } else {
        if (ele[type + 'onEvent']) {
            ele[type + 'onEvent'] = []
        }
        var a = ele[type + 'onEvent'];
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn) return;
        }
        a.push(fn);
        bind(ele, type, run);
    }
}
function off(ele, type, fn) {
    if (removeEventListener) {
        ele.removeEventListener(type, fn, false)
    } else {
        var a = ele[type + 'onEvent'];
        if (a && a.length) {
            for (var i = 0; i < a.length; i++) {
                if (a[i] == fn) {
                    a[i] = null;
                    break;
                }
            }
        }
    }
}
function run(){
    var e = window.event;
    var a = ele[type+'onEvent'];
    if (a && a.length){
        for (var i=0;i<a.length;i++){
            if (typeof a[i]==='function'){
                a[i].call(this.e);
            }else {
                a.splice(i,1);
                i--;
            }
        }
    }
}