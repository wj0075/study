/**
 * Created by wj007 on 2016/11/15.
 */
~function(){
    var wangjianEffect = {
        linear:function linear(t,b,c,d){
            return t/d*c+b;
        }
    };
    //功能：让一个物体，运动到指定位置；{left:xxx,top:xxx}
    function move(curEle,target,effect,callback){
        clearInterval(curEle.timer);//开始定时器前先关闭没用的定时器
        //运动形式
        var tmpEffect=wangjianEffect.linear;
        var ary = ["Linear","Elastic-easeOut","Back-easeOut","Bounce-easeOut","Expo-easeIn"];
        if(typeof effect === 'number'){
            var str = ary[effect%ary.length];
            ary = str.split('-');
            tmpEffect = ary.length>=2?wangjianEffect[ary[0]][ary[1]]:wangjianEffect[ary[0]];
        }else if(typeof effect === 'object'){
            tmpEffect = ary.length>=2?wangjianEffect[effect[0]][effect[1]]:wangjianEffect[effect[0]];
        }else if(typeof effect === 'function'){
            callback = effect;
        }
        //给linear 公式做准备
        var begin = {},change={};
        var duration = 700;
        var time = null;
        for(var attr in target){//给begin和target赋值
    begin[attr]=utils.getCss(curEle,attr);
            change[attr]= target[attr]-begin[attr];
        }
        curEle.timer = setInterval(function(){
            if (time>=duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                callback.call(curEle);
                return;
            }
            time+=10;//不断累加时间
            for(var attr in change){
                var curPos = tmpEffect(time,begin[attr],change[attr],duration)
                utils.css(curEle,attr,curPos)
            }
        },10)
    }
    window.animate = move;
}();
