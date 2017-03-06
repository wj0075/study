/**
 * Created by wj007 on 2016/11/16.
 */
~function(){
    var oBox = utils.getByClass('box')[0];
    var oBoxInner = utils.getByClass('boxInner',oBox)[0];
    var aDiv = oBoxInner.getElementsByTagName('div');
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oUl.getElementsByTagName('li');
    var aBtnLeft = oBox.getElementsByTagName('a')[0];
    var aBtnRight = oBox.getElementsByTagName('a')[1];
    var timer;
    var n=0;
    oBoxInner.innerHTML+='<div><img src="images/banner1.jpg" alt=""></div>';
    oBoxInner.style.width = aDiv[0].offsetWidth*aDiv.length+'px';
    //1：图片自动轮播
     timer = window.setInterval(autoMove,3000);
    function autoMove(){

        if (n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000)
        }
        n++;
       //1(2)2(3)3(4)4(5)
        //utils.css(oBoxInner,'left',-n*1000)
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000
        });
        bannerTip();
    }

    //2:焦点自动轮播
    function bannerTip(){
        var tmp = n>=aLi.length?0:n;//让n跟li可以同步，否则n:1,2,3,4 li:0,1,2,3
        for (var i=0;i<aLi.length;i++){
            aLi[i].className=i==tmp?'on':null;
        }
    }
    //3：移入停止移除开始
    oBox.onmouseover = function(){
        clearInterval(timer);
        aBtnLeft.style.display = aBtnRight.style.display = 'block';

    };
    oBox.onmouseout = function(){
        timer = window.setInterval(autoMove,2000);
        aBtnLeft.style.display = aBtnRight.style.display = 'none';
    };
    //4：点击焦点手动切换
   ~function(){
       for (var i=0;i<aLi.length;i++){
           aLi[i].index = i;
           aLi[i].onclick=function(){
                    n=this.index;
               animate({
                   id:oBoxInner,
                   target:{
                       left:-n*1000
                   },
                   duration:1000
               });
               bannerTip();
           }
       }
   }();
    //点击左右按钮，进行切换
    aBtnRight.onclick = autoMove;
    aBtnLeft.onclick = function(){
        if(n<=0){
            n=aDiv.length-1;
            utils.css(oBoxInner,'left',-n*1000)
        }
        n--;
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000
        });
        bannerTip();
    }




}();