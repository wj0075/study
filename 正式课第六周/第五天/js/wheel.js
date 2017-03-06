/**
 * Created by 39753 on 2016/12/4.
 */
(function(){
    //给元素添加滚轮事件，根据滚轮方向做不同的事情；
    window.wheel=function(ele,cb){
        function dir(e){
            e=e||window.event;
            var bOk=false;
            //alert(e.wheelDelta)//chrome&&IE:下-负； 上-正
            //alert(e.detail)//Firefox：下-正； 上-负；
            if(e.wheelDelta){//chrome&&IE
                bOk=e.wheelDelta<0?true:false;
            }else{
                bOk=e.detail>0?true:false;
            }
            cb && cb.call(ele,bOk);
            e.preventDefault?e.preventDefault():e.returnValue=false;
        }
        if(window.navigator.userAgent.toLowerCase().indexOf('firefox') !==-1){
            ele.addEventListener('DOMMouseScroll',dir,false);
        }else{
            ele.onmousewheel=dir;
        }
    }
})();