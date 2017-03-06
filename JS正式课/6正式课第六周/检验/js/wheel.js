~function(){
    //核心思路：
    //1.添加滚轮事件
    //2.判断滚轮方向
    //3·当滚轮事件被触发的时候，执行回调函数，同时，回调函数传实参--》滚轮方向

    window.wheel = function(ele,cb){
       function dir(e){
           e = e||window.event;
           var bOk = true;//代表滚轮方向
           if (e.wheelDelta){//IE
               bOk = e.wheelDelta<0?true:false;
           }else {
               bOk = e.detail<0?false:true;
           }
           cb && cb.call(ele,bOk);
           e.preventDefault?e.preventDefault():e.returnValue=false;
       }
        if (window.navigator.userAgent.toLowerCase().indexOf('firefox')!==-1){
            ele.addEventListener('DOMMouseScroll',dir,false)
        }else {
            ele.onmousewheel = dir;
        }
    }
}();
