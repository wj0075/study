var utils = {
        getCss:function(curEle,attr){
            var val = null;
            var reg = null;
            if('getComputedStyle' in window){
                val = getComputedStyle(curEle,null)[attr];
            }else {
                if (attr ==='opacity'){
                    val = curEle.currentStyle['filter'];
                    reg = /^alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi;
                    return reg.test(val)?RegExp.$1/100:1;
                }
                val = curEle.currentStyle[attr];
            }
            reg = /^(left|right|top|bottom|width|height|((margin|padding)(left|right|top|bottom)?))$/gi;
            return reg.test(attr)?parseFloat(val):val;
        },
        win:function(attr,val){
            if (val ===undefined){
                return document.documentElement[attr]||document.body[attr];
            }else {
                document.documentElement[attr]=document.body[attr]=val;
            }
        },
        offset:function(curEle){
            var par = curEle.offsetParent;
            var l = curEle.offsetLeft;
            var t = curEle.offsetTop;
            while (par){
                if (window.navigator.userAgent.indexOf('MSIE 8')===-1){
                    l+=par.clientLeft;
                    t+=par.clientTop;
                }
                l+=par.offsetLeft;
                t+=par.offsetTop;
                par = par.offsetParent;
            }
            return {left:l,top:t};
        }
};
