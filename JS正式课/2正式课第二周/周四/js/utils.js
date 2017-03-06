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
    }
};

