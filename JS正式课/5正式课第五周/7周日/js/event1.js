
function on(ele,type,fn){
    if (ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }else {
        if (!ele[type+'onEvent']){
            ele[type+'onEvent']=[];
            ele.attachEvent('on'+type,function(){
                run.call(ele)
            })
        }
        var a = ele[type+'onEvent'];
            for (var i=0;i<a.length;i++){
                if (a[i]===fn) return;
            }
        a.push(fn);
    }
}
function off(ele,type,fn){
    if (ele.removeEventListener){
        ele.removeEventListener(type,fn,false)
    }else {
        var a = ele[type+'onEvent'];
        for (var i=0;i<a.length;i++){
            if (a[i]==fn){
                a[i]=null;
                break;
            }
        }
    }
};
function run(){
    e = window.event;
    var a=this[e.type+'onEvent'];
    if (a && a.length){
        for(var i=0;i<a.length;i++){
            if (typeof a[i]==='function'){
                a[i].call(this,e)
            }else {
                a.splice(i,1);
                i--;
            }
        }
    }
}