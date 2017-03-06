/**
 * Created by wj007 on 2016/12/6.
 */
var a = require('./A');
function arg(){
        var arg1 = Array.prototype.slice.call(arguments);
        var arg2 = a.sum.apply(this,arg1);
        var arg3 = arg2/arg1.length;
        return arg3;
}
module.exports={
    arg:arg
};