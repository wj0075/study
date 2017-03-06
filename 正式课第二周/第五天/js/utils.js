
/**
 * Created by 39753 on 2016/11/6.
 */
var utils={
    makeArray:function(arg){
        var ary=[];
        try{
            ary=Array.prototype.slice.call(arg);
        }catch (e){
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i]);
            }
        }
        return ary;
    },
    jsonParse:function(str){
        return 'JSON' in window?JSON.parse(str):eval('('+str+')');
    }
}