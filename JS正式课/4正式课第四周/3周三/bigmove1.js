/**
 * Created by wj007 on 2016/11/16.
 */
~function(){
    var wjEffect = {
        Linear:function Linear(t,b,c,d){
            return t* c/d+b
        }
    };
    function move(opt){
        //对参数的处理
        if (!opt.id) return;
        var defaultOpt = {
            effect:0,
            duration:700
        };
        for (var attr in opt){
            defaultOpt[attr]=opt[attr];
        }
        //下面的参数与opt无关
        var tmpEffect = defaultOpt.effect;
        var effect = defaultOpt.effect;
        var curEle = defaultOpt.id;
        var target = defaultOpt.target;
        var duration = defaultOpt.duration;
        var ary = ["Linear","Bounce-easeOut","Back-easeIn"];
        //是对effect参数的处理
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[[0]]];
        }else if (typeof effect==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }
        //为Linear公式准备参数
        var begin={},change={},time=0;
        for (var attr in target){
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function(){
            time+=10;
            if (time>duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                return;
            }
            for (var attr in begin){
                var curPos = tmpEffect(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos)
            }
        },10)
    }
    window.animate = move;
}();