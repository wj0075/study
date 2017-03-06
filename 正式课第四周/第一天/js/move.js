/**
 * Created by 39753 on 2016/11/15.
 */
(function(){
    //用单例模式写了运动公式；
    var zhufengEffect={
        Linear:function(t,b,c,d){
            return b+t*c/d;
        }
    };
    //功能：让一个物体，运动到指定的位置；{left:xx,top:xx,width:xxx,height:xxx}
    function move(curEle,target){
       //给Linear公式准备参数：
        var begin={},change={};
        var duration=700;
        var time=null;
        for(var attr in target){//给begin和target赋值；
            begin[attr]=utils.getCss(curEle,attr);
            change[attr]=target[attr]-begin[attr];
        }
        var timer=setInterval(function(){
            if(time>=duration){//判断停止条件；
                utils.css(curEle,target);
                clearInterval(timer);
                return;
            }
            time+=10;//不断累加时间
            for(var attr in change){//通过遍历，拿到每个属性对应的最新位置，同时设置最新位置；
                var curPos=zhufengEffect.Linear(time,begin[attr],change[attr],duration);
                utils.css(curEle,attr,curPos);
            }
        },10);

    }
    window.animate=move;//通过window把move暴露在全局，任何地方都可以使用；
})();