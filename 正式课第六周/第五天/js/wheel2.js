/**
 * Created by 39753 on 2016/12/4.
 */
/*
* 核心思路：
* 1.添加滚轮事件
* 2.判断滚轮方向；
* 3.当滚轮事件被触发的时候，执行回调函数，同时，回调函数传实参-》滚轮方向；
*
* */
(function(){
    window.wheel=function(ele,cb){
        //2.判断滚轮方向
        function dir(e){
            e=e||window.event;
            var bOk=true;//代表滚轮方向；
            //alert(e.wheelDelta)//chrome、IE：down-150 up：150
            //console.log(e.detail)//firefox:down 3; up:-3;
            //统一鼠标滚轮方向：down true；up false；
            if(e.wheelDelta){//IE和chrome
                bOk=e.wheelDelta<0?true:false;
            }else{//Firefox；
                bOk=e.detail>0?true:false;
            }
            cb && cb.call(ele,bOk);
            e.preventDefault?e.preventDefault():e.returnValue=false;
        }
        //1.给当前元素添加滚轮事件
        if(window.navigator.userAgent.toLocaleLowerCase().indexOf('firefox') !== -1){
            ele.addEventListener('DOMMouseScroll',dir,false);
        }else{
            ele.onmousewheel=dir;
        }
    }
})();