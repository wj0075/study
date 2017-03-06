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
    var n = 0;
    var timer = null;
    //先给盒子增加一张图片用来补第一张图片的位置
    //oBoxInner.innerHTML+='<div><img src="images/banner1.jpg" alt=""></div>';
    //不要忘记给大盒子改变宽度
    //oBoxInner.style.width = aDiv[0].offsetWidth*aDiv.length+'px';
    //轮播图开始工作
    timer = window.setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000)
        }
        n++;
        //utils.css(oBoxInner,'left',-n*1000);
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            }
        });
        bannerTip();
    }
    //焦点轮播转换
    function bannerTip(){
        var tmp = n>=aLi.length?0:n;
        for (var i=0;i<aLi.length;i++){
            i==n?aLi[i].className = 'on':aLi[i].className=null;
        }
    };
    //鼠标移入移除
    oBox.onmouseover=function(){
        clearInterval(timer);
        aBtnLeft.style.display = aBtnRight.style.display='block'
    };
    oBox.onmouseout=function(){
        timer = window.setInterval(autoMove,2000)
        aBtnLeft.style.display = aBtnRight.style.display='none'
    };
    //4.点击焦点实现变换
    ~function(){
        for (var i=0;i<aLi.length;i++){
            aLi[i].index = i;
            aLi[i].onclick = function(){
                n = this.index;
                animate({
                    id:oBoxInner,
                    target:{
                        left:-n*1000
                }
                });
                bannerTip();
            }
        }
    }();
    //5.点击左右按钮实现切换
    aBtnRight.onclick=autoMove;
    aBtnLeft.onclick=function(){
        if(n<=0){
            n=aLi.length;
            utils.css(oBoxInner,'left',-n*1000)
        }
        n--;
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            }
        });
        bannerTip();
    }


}();