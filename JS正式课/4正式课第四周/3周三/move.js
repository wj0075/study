/**
 * Created by wj007 on 2016/11/16.
 */
var wjEffect = {
    Linear:function Linear(t,b,c,d){
        return t*c/d+b;
    }
};
function move(curEle,target,callback,effect,duration){
    var tmpEffect=wjEffect.Linear;
    //为linear做准备
    var ary = ["Linear","Bounce-easeOut","Circ-easeIn","Back-easeOut","Elastic-easeIn"];
    if (typeof effect==='number'){
        var str = ary[effect%ary.length];
        ary = str.split('-');
        tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
    }else if (typeof effect==='object'){
        tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
    }else if (typeof effect==='function'){
        callback = effect;
    }
    var begin = {},change={};
    var duration = duration||700,time =0;
    for (var key in target){
        begin[key] = utils.getCss(curEle,key);
        change[key]=target[key]-begin[key];
    }
    curEle.timer = window.setInterval(function(){
        if (time>=duration){
            utils.css(curEle,target);
            clearInterval(curEle.timer);
            callback.call(curEle);
            return;

        }
        time +=10;
        for (var key in begin){
            var curPos = tmpEffect(time,begin[key],change[key],duration);
            utils.css(curEle,key,curPos)
        }
    },10);


}
window.animate = move;