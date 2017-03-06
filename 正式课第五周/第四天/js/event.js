/**
 * Created by 39753 on 2016/11/26.
 */
function bind(ele,type,fn){//fn1 fn2 fn3 fn4 fn5
    if(ele.addEventListener){//标准浏览器
        ele.addEventListener(type,fn,false);
    }else{//IE浏览器
        var tmpFn=function(){
            fn.call(ele);//解决this问题；
        };
        tmpFn.name=fn;
        if(!ele[type+'aEvent']){ //<div clickaEvent=[tmpFn,tmpFn,tmpFn] mouseoveraEvent=[]>
            ele[type+'aEvent']=[];
        }
        var a=ele[type+'aEvent'];
        for(var i=0; i<a.length; i++){//解决重复绑定的问题
            if(a[i].name==fn) return;//阻断程序执行的作用；
        }
        a.push(tmpFn);//把要绑定的方法放入自己事件池；
        ele.attachEvent('on'+type,tmpFn);//把要绑定的方法放入系统事件池；
    }
};
function unbind(ele,type,fn){
    if(ele.removeEventListener){//标准浏览器
        ele.removeEventListener(type,fn,false);
    }else{//IE浏览器
        var a=ele[type+'aEvent'];//首先拿到数组：自己事件池
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i].name==fn){//1
                    ele.detachEvent('on'+type,a[i]);
                    a[i]=null;//让自己事件池变为null;
                    /*ele.detachEvent('on'+type,a[i]);
                    a.splice(i,1);//注意，这里有会塌陷问题*/
                }
            }
        }
    }
};
function on(ele,type,fn){//标准浏览器：浏览器自己处理； IE浏览器：把该行为下所有要绑定的方法，都放进自己事件池，给系统事件池中只放了一个run方法
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }else{
        if(!ele[type+'onEvent']){
            ele[type+'onEvent']=[];
        }
        var a=ele[type+'onEvent'];
        for(var i=0; i<a.length; i++){
            if(a[i]===fn) return;
        }
        a.push(fn); //所有该行为下的方法，都放进自己事件池
        bind(ele,type,run);
    }

}
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{//IE处理：1）拿到数组  2）判断数组的哪个函数==fn;
        var a=ele[type+'onEvent'];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i]===fn){
                    a[i]=null;
                    break;
                }
            }
        }
    }
}
function run(){//拿到数组，顺序调用；
    var e=window.event;
    //this->元素
    var a=this[e.type+'onEvent'];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(typeof a[i]==='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}