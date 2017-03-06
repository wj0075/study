/**
 * Created by wj007 on 2016/11/15.
 */
~function(){
    var wjEffect = {
        Linear:function Linear(t,b,c,d){
            return t/d*c+b;
        }
    };
    function move(curEle,target,callback,effect,duration){
        var tmpEffect = wjEffect.Linear;
        var ary = ["Linear","Elastic-easeOut","Back-easeOut","Bounce-easeIn","Expo-easeIn"]
        if (typeof effect ==='number'){
            var str =ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect ==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }else if (typeof effect ==='function'){
            callback = effect;
        }
        //为linear做准备
        var begin = {},change={};
        var duration = duration||700,time=0;
        for (var attr in target){
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]= target[attr]-begin[attr];
        }
        curEle.timer = window.setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                callback.call(curEle);
                return;
            }
            time+=10;
            for (var attr in begin){
                var curPos = tmpEffect(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos);
            }
        },10);
    }
    window.animate = move;
}();