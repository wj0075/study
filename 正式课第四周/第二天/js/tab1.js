/**
 * Created by 39753 on 2016/11/16.
 */
//1.图片自动轮播 2.焦点自动轮播 3.移入停止移出继续 4.点击焦点手动切换 5.点击左右按钮进行切换
(function(){
    //获取元素
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var aLi=oBox.getElementsByTagName('li');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var n=0;//n的作用：决定让第几张图片显示；
    var timer=null;
    //1.图片自动轮播
    //给oBoxInner末尾添加一张跟第一张图片一模一样的图片，放在后面；--注意更改oBoxInner宽度；
    oBoxInner.innerHTML+='<div><img src="img/banner1.jpg" alt=""></div>';
    oBoxInner.style.width=aDiv[0].offsetWidth*aDiv.length+'px';
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000);
        }
        n++;//1 2 3 4
        //utils.css(oBoxInner,'left',-n*1000);
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000
        });
        bannerTip();
    }
    //2：焦点自动轮播
    function bannerTip(){
        var tmp=n>=aLi.length?0:n;//让n跟li可以同步，否则n：1,2,3,4 li:0,1,2,3
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==tmp?'on':null;
            /*if(i===tmp){
                aLi[i].className='on'
            }else{
                aLi[i].className=null;
            }*/
        }
    }
    //3.移入停止移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000);
        oBtnLeft.style.display=oBtnRight.style.display='none';
    };
    //4.点击焦点手动切换
    for(var i=0; i<aLi.length; i++){
        aLi[i].index=i;
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
    //5.点击左右按钮进行切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length-1;
            utils.css(oBoxInner,'left',-n*1000);

        }
        n--;
        console.log(n);
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000
        });
        bannerTip();
    }
})();