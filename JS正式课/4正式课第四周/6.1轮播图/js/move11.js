~function(){
    var wjEffect = {
        Linear:function(t,b,c,d){
            return t*c/d+b
        }
    };
    function move(opt){
      //1.对参数的处理

        if(!opt.id) return;

        var defaultOpt = {
            effect:0,
            duration:700,
        };

        for (var key in opt){
            defaultOpt[key]=opt[key];
        }

        //写成简单的变量
        var effect = defaultOpt.effect,
            curEle=defaultOpt.id,
            target=defaultOpt.target,
            duration=defaultOpt.duration;
        var tmpEffect = null;
        var time = 0,
            begin = {},
            change = {};
        var ary = ["Linear","Bounce-easeIn","Back-easeOut","Expo-easeInOut","Elastic-easeIn"];
        //对运动形式的处理
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect === 'object'){
            tmpEffect=effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }
        //为Linear公式准备参数
        for(var key in target){

            begin[key]=utils.getCss(curEle,key);
            change[key]=target[key]-begin[key];

        }
        clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function(){
            if (time>=duration){
                clearInterval(curEle.length);
                utils.setGroupCss(curEle,target)
                return;
            }
            time+=10;
            for (var key in begin){
                var curPos = tmpEffect(time,begin[key],change[key],duration);
                utils.setCss(curEle,key,curPos)
            }
        },10)
    }
    window.animate=move;




}();
