
    var utils = {
        getCss:function getCss(curEle,attr){
            var val = null;
            var reg = null;
            if ('getComputedStyle' in window){
                val = getComputedStyle(curEle,false)[attr];
            }else {
                if (attr==='opacity'){
                    val = curEle.currentStyle['filter'];
                    reg = /^alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi
                    return reg.test(reg)?RegExp.$1/100:1;

                }
                val = curEle.currentStyle[attr];
            }
            reg= /^(left|right|top|bottom|width|height|((margin|padding)(left|right|top|bottom)?))$/g
            return reg.test(attr)?parseFloat(val):val;
        },
        setCss:function setCss(curEle,attr,val){
            var reg = /^([+-])?(\d+(\.\d+)?)(px|pt|rem|em|%)?$/gi;
            //1.对float处理
            if (attr=='float'){
                curEle.style.stylefloat = val;
                curEle.style.cssFloat = val;
                return;
            }
            if (attr === 'opacity'){
                curEle.style['opacity']=val;
                curEle.style['filter']='alpha(opacity='+val*100+')';
                return;
            }
            if (reg.test(val)){
                if (!isNaN(val)&&attr!=='zIndex'){
                    val = val+'px';
                }
            }
            curEle.style[attr]=val;
        },
        setGroupCss:function(curEle,obj){
            if (Object.prototype.toString.call(obj)==='[object Object]'){
                for (var key in obj){
                    this.setCss(curEle,key,obj[key])
                }
            }
        },
        makeArray:function makeArray(arg){
            var ary = [];
            try {
             ary= Array.prototype.slice.call(arg)
            }catch (e){
                for (var i=0;i<arg.length;i++){
                    ary.push(arg[i])
                }
            }
            return ary;
        },
        jsonParse:function jsonParse(jsonStr){
            return 'JSON' in window ? JSON.parse(jsonStr):eval('('+jsonStr+')');
        }


    };



