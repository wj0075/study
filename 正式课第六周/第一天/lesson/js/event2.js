/**
 * Created by 39753 on 2016/11/29.
 */
(function(){
    function on(ele,type,fn){
        //绑定时，区分自定义事件和系统事件
        if(/^self/.test(type)){//自定义事件--订阅
            if(!ele[type]){
                ele[type]=[];
            }
            var a=ele[type];
            for(var i=0; i<a.length; i++){
                if(a[i]===fn) return;
            }
            a.push(fn);
        }else{//系统事件
            if(ele.addEventListener){
                ele.addEventListener(type,fn,false);
            }else{
                if(!ele[type+'onEvent']){
                    ele[type+'onEvent']=[];
                    //解决run重复绑定问题；
                    ele.attachEvent('on'+type,function(){
                        run.call(ele);//解决this问题
                    });
                }
                var a=ele[type+'onEvent'];
                for(var i=0; i<a.length; i++){
                    if(a[i]===fn) return;
                }
                a.push(fn);//把所有系统事件对应的函数，都放进自己事件池；
            }

        }
    }
    function off(ele,type,fn){//解除系统事件，解除自定义事件
        if(/^self/.test(type)){//解除自定义事件绑定：拿到数组，比对解除
            var a=ele[type];
            if(a && a.length){
                for(var i=0; i<a.length; i++){
                    if(a[i]===fn){
                        a[i]=null;
                        break;
                    }
                }
            }
        }else{//解除系统事件绑定
            if(ele.removeEventListener){
                ele.removeEventListener(type,fn,false);
            }else{
                var a=ele[type+'onEvent'];
                if(a && a.length){
                    for(var i=0; i<a.length; i++){
                        if(a[i]==fn){
                            a[i]=null;
                            break;
                        }
                    }
                }
            }
        }

    }
    function run(){//解决IE问题；取到数组，顺序调用；
        var e=window.event;
        var a=this[e.type+'onEvent'];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(typeof a[i]==='function'){
                    a[i].call(this,e)
                }else{
                    a.splice(i,1);
                    i--;
                }
            }
        }
    }
    function fire(ele,type,e){//发布自定义事件绑定的方法：拿到数组顺序调用；
        var a=ele[type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(typeof a[i]==='function'){
                    a[i].call(ele,e)
                }else{
                    a.splice(i,1);
                    i--;
                }
            }
        }
    }
    function processThis(fn,context){
        return function (e){
            fn.call(context,e)
        }
    }
    window.ev={
        on:on,
        off:off,
        run:run,
        fire:fire,
        processThis:processThis
    }
})();