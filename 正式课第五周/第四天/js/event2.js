/**
 * Created by 39753 on 2016/11/26.
 */
function bind(ele,type,fn){
    if(ele.addEventListener){//标准浏览器
        ele.addEventListener(type,fn,false);
    }else{//IE浏览器
        var tmpFn=function(){
            fn.call(ele);
        };
        tmpFn.name=fn;
        if(!ele[type+'aEvent']){
            ele[type+'aEvent']=[];
        }
        var a=ele[type+'aEvent'];
        for(var i=0; i<a.length; i++){
            if(a[i].name===fn) return;//阻断程序执行的作用；
        }
        a.push(tmpFn);//放进自己事件池  [tmpFn,tmpFn,tmpFn,tmpFn]
        ele.attachEvent('on'+type,tmpFn);//放进系统事件池
    }
}
function unbind(ele,type,fn){
    if(ele.removeEventListener){//标准浏览器
        ele.removeEventListener(type,fn,false);
    }else{//IE浏览器
        var a=ele[type+'aEvent'];//1：拿数组
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i].name===fn){// 1
                    ele.detachEvent('on'+type,a[i]);//1  fn3
                    a.splice(i,1);// 1 ->自己事件池 fn2
                }
            }
        }

    }
}