/**
 * Created by wj007 on 2016/11/16.
 */
~function(){
    var wjEffect = {
        Linear:function Linear(t,b,c,d){
            return t*c/d+b
        }
    };
    function move(opt){
        //首先判断时候传入执行主体
        if(!opt.id) return;
        //内置对象
        var defaultOpt = {
            effect:0,
            duration:700
        };
        for (var key in opt){//与传入的参数已经无关
          defaultOpt[key]=opt[key];
        }
        var tmpEffect = defaultOpt.effect;
        var curEle = defaultOpt.id;
        var target = defaultOpt.target;
        var effect = defaultOpt.effect;
        var duration = defaultOpt.duration;
        var callback = defaultOpt.callback;
        var ary = ["Linear","Bounce-easeOut","back-easeIn","Expo-easeIn","Elastic-easeOut"]
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        };
        //为linear公式做准备
        var begin = {},change ={},time = 0;
        for (var key in target){
            begin[key]=utils.getCss(curEle,key);
            change[key]=target[key]-begin[key];
        }
        clearInterval(curEle.timer);
        curEle.timer=window.setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                return;
            }
            time+=10;
            for (var key in change){
                var curPos = tmpEffect(time,begin[key],change[key],duration)
                utils.css(curEle,key,curPos)
            }
        },10)



    }

    window.animate = move;


}();