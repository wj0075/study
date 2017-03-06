~function () {
    //核心思路：
    //添加滚轮事件
    //判断滚轮方向
    //当滚轮事件被触发的时候执行回调函数同时回调函数传参，传实参，滚轮方向；
    window.wheel = function (ele, cb) {
        //2.判断滚轮方向
        function dir(e){
            e=e||window.event;
            var bOk =true;//代表滚轮方向
            if (e.wheelDelta){
                bOk = e.wheelDelta<0?true:false;
            }else {
                bOk=e.detail>0?true:false;
            }
           cb && cb.call(ele,bOk);
        }
        //IE和谷歌中，向下滚都是负数   向上滚都是正数
        //在firefox中，向下滚是正数，向上滚是负数
        //并且在IE和chorme中滚轮方向属性是e.wheelDelta
        //在火狐下  判断方向的属性是e.detail
        //.给当前元素添加滚轮事件
        if (window.navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
            ele.addEventListener('DOMMouseScroll',dir,false)

        } else {//IE和chorme
            ele.onmousewheel=dir;
        }


    }


}();

