var utils = {
    /**
     * makeArray 功能：类数组转数组方法封装
     * @param arg  传进的参数（一个类数组）
     * @returns {Array} 返回一个数组
     */
    makeArray:function makeArray(arg){
        var ary = [];
        try{
            ary = Array.prototype.slice.call(arg);
        }catch(e){
            for(var i = 0;i < arg.length;i++){
                ary.push(arg[i]);
            }
        }
        return ary
    },
    /**
     * jsonParse 功能：把JSON格式的字符串，转成JSON格式的数据（对象）
     * @param str 传入的JSON格式的字符串
     * @returns {Object}  转换好的JSON格式的对象
     */
    jsonParse:function jsonParse(str){
        return 'JSON' in window ? JSON.parse(str):eval('('+str+')');
    },
    /**
     * getChildren 功能：获取子元素节点
     * @param curEle  父级元素
     * @returns {Array}  返回一个数组，包含所有的子级元素节点
     */
    getChildren:function getChildren(curEle){
        var aChild = curEle.childNodes;//所有子节点
        var ary = [];
        for(var i = 0;i < aChild.length; i++){
            if (aChild[i].nodeType===1){
                ary.push(aChild[i])
            }
        }
        return ary;
    },
    /**
     * hasPubProperty 功能：判断是否为公有属性
     * @param attr  属性
     * @param obj   属性所在对象
     * @returns {boolean} 返回是否
     */
    hasPubProperty:function hasPubProperty(attr,obj){
        return 'attr' in obj && !obj.hasOwnProperty(attr);
    }
};

