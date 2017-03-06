/**
 * Created by 39753 on 2016/11/3.
 */
var utils={
    // makeArray:类数组转数组
    makeArray:function(arg){
        try{
            return Array.prototype.slice.call(arg);
        }catch(e){
            var ary=[];
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
            return ary;
        }

    },
    //jsonParse:把JSON格式的字符串，转成JSON格式的对象；
    jsonParse:function(jsonStr){
        return 'JSON' in window? JSON.parse(jsonStr):eval('('+jsonStr+')');
    },
    //getChildren:获取当前元素下的所有子元素；
    getChildren:function(curEle){
        var aChild=curEle.childNodes;//所有子节点
        var ary=[];
        for(var i=0; i<aChild.length; i++){
            if(aChild[i].nodeType===1){
                ary.push(aChild[i]);
            }
        }
        return ary;
    },
    //prev：获取当前元素的上一个哥哥元素
    prev:function(curEle){
        if(curEle.previousElementSibling){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType !== 1){
            pre=pre.previousSibling;
        }
        return pre;
    },
    //hasPubProperty:判断某个属性是否为对象上的公有属性
    hasPubProperty:function(attr,obj){
        return 'attr' in obj && !obj.hasOwnProperty(attr);
    },
}