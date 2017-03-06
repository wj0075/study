/**
 * Created by wj007 on 2016/11/17.
 */
~function(){
    var wjEffect={
        Linear:function Linear(t,b,c,d){
            return t*c/d+b;
        }
    };
    function move(opt){
        if (!opt.id) return;
        var defaultOpt = {
            effect:0,
            duration:700
        };
        for (var attr in opt){
            defaultOpt[attr]=opt[attr];
        }
        var tmpEffect = null;
        var effect = defaultOpt.effect;
        var curEle = defaultOpt.id;
        var target = defaultOpt.target;
        var duration = defaultOpt.duration;
        var ary = ["Linear","Bounce-easeIn","Back-easeOut","Expo-easeIn"];
        if (typeof effect ==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect ==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }
        var begin = {},change={},time=0;
        for (var attr in target){
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                return;
            }
            time+=10;
            for (var attr in begin){
                var curPos = tmpEffect(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos);
            }
        },10)
    }
    window.animate = move;






}();