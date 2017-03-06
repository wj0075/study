~function(){
    var wjEffect={
        Linear:function(t,b,c,d){
            return t*c/d+b;
        }
    };
    function move(opt){
        //1.对参数的处理
        if(!opt.id)return;
        console.log('ok');
        var defaultOpt = {
            effect:0,
            duration:700
        };
        for (var key in opt){
          defaultOpt[key]=opt[key];
        }

        //2.简化变量
        var curEle = defaultOpt.id;
        var target = defaultOpt.target;
        var effect = defaultOpt.effect;
        var duration = defaultOpt.duration;

        var tmpEffect = null;
        var begin = {},change={},time = 0;
        var ary = ["Linear"];
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect ==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }

        //为Linear公式做准备
        for(var key in target){
            begin[key] = utils.getCss(curEle,'left');
            change[key] = target[key]-begin[key];
        }

        clearInterval(curEle.timer);
        curEle.timer = setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                defaultOpt.callback && defaultOpt.callback .call(curEle);
                return;
            }
            time+=10;
            for (var key in begin){
                var curPos = tmpEffect(time,begin[key],change[key],duration);
                console.log(curPos);
                utils.css(curEle,key,curPos)
            }
        },10)


    }
    window.animate = move;




}();
