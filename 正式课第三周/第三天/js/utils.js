/**
 * Created by 39753 on 2016/11/9.
 */
var utils={
    //makeArray:类数组转数组
    makeArray:function(arg){
        var ary=[];
        if('getComputedStyle' in window){//标准浏览器
            ary=Array.prototype.slice.call(arg);
        }else{//IE浏览器；
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
        }
        return ary;
    },
    //jsonParse:JSON格式的字符串转成JSON格式的数据（对象）
    jsonParse:function(jsonStr){
        return 'JSON' in window?JSON.parse(jsonStr):eval('('+jsonStr+')');
    },
    //getCss:获取非行间样式；
    getCss:function(curEle,attr){
        var val=null;
        var reg=null;
        if('getComputedStyle' in window){
            val=getComputedStyle(curEle,false)[attr];
        }else{
            if(attr==='opacity'){
                val=curEle.currentStyle['filter'];//alpha(opacity=10);
                reg=/^alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi;
                return reg.test(val)?RegExp.$1/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        reg=/(left|top|right|bottom|width|height|((margin|padding)(left|top|right|bottom)?))/gi;
        return reg.test(attr)?parseFloat(val):val;
    },
    //win:JS盒子模型兼容处理；
    win:function(attr,value){
        if(value===undefined){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    },
    //offset:求盒子模型的偏移量； 当前元素到body的距离；
    offset:function(curEle){
        var par=curEle.offsetParent;
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        while(par){
            if(window.navigator.userAgent.indexOf('MSIE 8')==-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t};
    },
    //rnd:求一定范围的随机数
    rnd:function(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();//当返回0-1之间的随机小数，就代表传参传错了；
        }
        if(n>m){
            var tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    },







}