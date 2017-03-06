~function(){
    var wjEffect = {
        Linear:function(t,b,c,d){
            return t*c/d+b;
        }
    };
    function move(opt){
        //对参数的处理
        if (!opt.id) return;
        var defaultOpt = {
            effect:0,
            duration:700
        };
        for (var key in opt){
            defaultOpt[key]=opt[key];
        }
        //接下来就和opt没有任何关系了，用的都是默认参数
        var curEle = defaultOpt.id,target = defaultOpt.target,effect = defaultOpt.effect,duration = defaultOpt.duration;
        var begin = {},change={},time = 0;
        //对运动形式的处理
        var tmpEffect = null;
        var ary = ["Linear","Bounce-easeIn","Exop-easeOut","Back-easeIn","Elastic-easeInOut"];
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length==2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect==='object'){
            tmpEffect = effect.length==2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }
        //为linear公式准备参数
        for (var key in target){
            begin[key]=utils.getCss(curEle,key);
            change[key]=target[key]-begin[key];
        }
        clearInterval(curEle.timer);
        curEle.timer = setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                defaultOpt.callback&&defaultOpt.callback.call(curEle);
                return
            }
            time+=10;
            for (var key in begin){
                var curPos = tmpEffect(time,begin[key],change[key],duration)
                utils.css(curEle,key,curPos);
            }
        },10)
    }
    window.animate = move;







}();