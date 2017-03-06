/**
 * Created by wj007 on 2016/11/15.
 */
var utils = {
    makeArray: function makeArray(arg) {
        if ('getComputedStyle' in window) {
            return Array.prototype.slice.call(arg);
        } else {
            var ary = [];
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i]);
            }
            return ary;
        }
    },
    win:function win(attr,value){
        if (value === undefined){
            return document.documentElement[attr]||document.body[attr];
        }else {
            document.documentElement[attr]=document.body[attr]=value;
        }
    },
    rnd:function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
}
