/**
 * Created by 39753 on 2016/11/27.
 */
function on(ele,type,fn){//type：1）系统行为 click dbclick 2）自定义行为：以self开头的行为
    if(/^self/.test(type)){//自定义的行为
        if(!ele[type]){
            ele[type]=[];
        }
        var a=ele[type];
        for(var i=0; i<a.length; i++){
            if(a[i]==fn) return;
        }
        a.push(fn);//放到自己事件池中；
    }else{//系统行为；
        if(ele.addEventListener){//标准浏览器
            ele.addEventListener(type,fn,false);
        }else{//IE浏览器
            if(!ele[type+'onEvent']){
                ele[type+'onEvent']=[];
                //解决了attachEvent重复绑定的问题；
                ele.attachEvent('on'+type,function(){//把包裹run方法的匿名函数放进系统事件池，因为我们就没想再解除这个事件绑定；
                    run.call(ele);//处理this问题；
                });
            }
            var a=ele[type+'onEvent'];
            for(var i=0; i<a.length; i++){
                if(a[i]===fn) return;
            }
            a.push(fn);//把跟某个行为相关的方法都存进自己事件池，自己事件池本质就是个数组；

        }
    }
}
function off(ele,type,fn){
    if(/^self/.test(type)){//解除自定义事件绑定的方法；
        var a=ele[type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i] === fn){
                    a[i]=null;
                    break;
                }
            }
        }
    }else{//解除系统事件绑定的方法
        if(ele.removeEventListener){//标准浏览器解除事件绑定
            ele.removeEventListener(type,fn,false);
        }else{//IE浏览器解除事件绑定；  拿到数组，进行比对
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
}
function run(){//拿到数组，顺序调用  [fn1,fn2,null,null]
    var e=window.event;
    //run:
    e.target=e.target||e.srcElement;//事件源
    e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
    e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
    e.preventDefault=function(){
        e.returnValue=false;
    };
    e.stopPropagation=function(){
        e.cancelBubble=true;
    };
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
function fire(ele,type,e){//把跟自定义行为有关的所有方法，进行顺序调用：拿数组，顺序调用；
    var a=ele[type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(typeof a[i]==='function'){
                a[i].call(ele,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function processThis(fn,context){
    return function (e){
        fn.call(context,e);
    }
}








