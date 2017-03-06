/**
 * Created by wj007 on 2016/11/18.
 */
~function(){
    var wjEffect = {
        Linear:function Linear(t,b,c,d){
            return t*c/d+b;
        }
    };
    function move(opt){
        //1.首先判断参数
        if(!opt.id) return;
        var defaultOpt={//函数中默认的接受传进来的参数的对象；以防止传参的顺序混乱。
            effect:0,
            duration:700
        };
        for (var key in opt){//将传进来的对象中的每一项拷贝到函数中的默认对象中；
            defaultOpt[key]=opt[key];
        }
        var effect= defaultOpt.effect,
            curEle = defaultOpt.id,
            target=defaultOpt.target,
            duration=defaultOpt.duration;
        var tmpEffect = null;
        var begin={},
            change={},
            time = 0;
        //对运动形式的处理
        var ary = ["Linear","Bounce-easeIn","Back-easeOut","Expo-easeInOut","Elastic-easeOut"];
        if (typeof effect==='number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wjEffect[ary[0]][ary[1]]:wjEffect[ary[0]];
        }else if (typeof effect ==='object'){
            tmpEffect = effect.length>=2?wjEffect[effect[0]][effect[1]]:wjEffect[effect[0]];
        }
        //为运动形式公式，准备参数
        for(var attr in target){
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        clearInterval(curEle.timer);
        curEle.timer = window.setInterval(function(){
            if(time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                defaultOpt.callback && defaultOpt.callback.call(curEle);
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