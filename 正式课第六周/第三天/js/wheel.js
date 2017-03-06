/**
 * Created by 39753 on 2016/12/1.
 */
(function(){
    function addWheel(ele,fn){
        function wheel(e){
            e=e||window.event;
            var bOk=false;//bOk代表了鼠标滚轮的方向；
            //alert(e.wheelDelta)//chrome，IE：下-》负数 上-》正数
            //alert(e.detail)//firefox：下-》正数 上-》负数
            if(e.detail){//firefox；
                bOk= e.detail>0?true:false;//下：真；上：假；
            }else{//chrome和IE；
                bOk= e.wheelDelta<0?true:false;
            }
            fn && fn.call(ele,bOk);
            e.preventDefault? e.preventDefault(): e.returnValue=false;

        }
        //1.浏览器判断
        if(window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1){
            ele.addEventListener('DOMMouseScroll',wheel,false);
        }else{//chrome和IE；
            ele.onmousewheel=wheel;
        }
    }
    window.addWheel=addWheel;
})();