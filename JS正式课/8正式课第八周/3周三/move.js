((function () {
    var wjEffect = {
        Leaner: function (c, b, t, d) {
            return c * t / d + b;
        }
    };

    function animate(opt) {
        if (!opt.id) return;
        var _default = {
            effect: 0,
            duration: 700
        };
        for (var key in opt) {
            if (!opt.hasOwnProperty(key)) continue;
            _default[key] = opt[key]
        }
        var tempEffect = null,
            effect = _default.effect,
            curEle = _default.id,
            duration = _default.duration,
            target = _default.target;
        var ary = ['Leaner'];
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
                ary = str.split('-');
            tempEffect =ary.length>=2? wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect==='string'){
            tempEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]]
        };
        //下面都是为运动公式准备参数
        var begin ={},change = {},time = null;
        for (var key in target){
            if (!target.hasOwnProperty(key)) continue;
            begin[key]=utils.getCss(curEle,key);
            change[key]=target[key]-begin[key];
        }
        clearInterval(curEle.timer);
        curEle.timer = setInterval(function(){
            if (time>=duration){
                clearInterval(curEle.timer)
                utils.css(curEle,target)
                return;
            }
            time+=10;
            for (var key in target){
                var curPos = tempEffect(change[key],begin[key],time,duration)
                utils.css(curEle,key,curPos)
            }
        },10)
    }
    window.animate = animate;
})());
