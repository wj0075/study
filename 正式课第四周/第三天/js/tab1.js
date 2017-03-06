/**
 * Created by 39753 on 2016/11/17.
 */
(function () {
    //在同一个父级下获取元素
    var oBox = document.getElementById('box');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div');
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oBox.getElementsByTagName('li');
    var aImg=oBoxInner.getElementsByTagName('img');
    var oBtnLeft = oBox.getElementsByTagName('a')[0];
    var oBtnRight = oBox.getElementsByTagName('a')[1];
    var data = null;
    var timer=null;
    var n=0;
    //1.获取并解析数据
    getData();
    function getData() {
        var xml = new XMLHttpRequest;
        xml.open('get', 'json/data.txt', false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    }
    //2.绑定数据
    bind();
    function bind(){
        var strDiv="";
        var strLi='';
        for(var i=0; i<data.length; i++){
            strDiv+='<div><img src="" realImg="'+data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+data[0].imgSrc+'" alt=""></div>';
        oBoxInner.innerHTML=strDiv;
        oBoxInner.style.width=aDiv[0].offsetWidth*aDiv.length+'px';
        oUl.innerHTML=strLi;
    }
    //3.图片延迟加载
    setTimeout(lazyImg,500);
    function lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var cur=aImg[index];
                var tmpImg=new Image;
                tmpImg.src=cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src=this.src;
                    tmpImg=null;
                };
                tmpImg.onerror=function(){
                    cur.parentNode.style.background='url("img/error.gif") no-repeat center #ccc';
                }
            })(i);
        }
    }
    //4.图片自动轮播
    clearInterval(timer);
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000);
        }
        n++;
       // utils.css(oBoxInner,'left',-n*1000);
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000,
            effect:2
        })
        bannerTip();
    }
    //5.焦点自动轮播
    function bannerTip(){
        var tmp=n>=aLi.length?0:n;
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==tmp?'on':null;
        }
    }
    //6.移入停止移出继续
    oBox.onmouseover=function(){
        clearInterval(timer);
        oBtnLeft.style.display=oBtnRight.style.display='block';
    };
    oBox.onmouseout=function(){
        timer=setInterval(autoMove,2000);
        oBtnLeft.style.display=oBtnRight.style.display='none';
    };
    //7.点击焦点手动切换
    handleChange();
    function handleChange(){
        for(var i=0; i<aLi.length; i++){
            (function(index){
                aLi[i].onclick=function(){
                    n=index;
                    animate({
                        id:oBoxInner,
                        target:{
                            left:-n*1000
                        },
                        duration:1000,
                        effect:2
                    })
                    bannerTip();
                }
            })(i);
        }
    }
    //8.点击左右按钮进行切换；
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length-1;
            utils.css(oBoxInner,'left',-n*1000);
        }
        n--;
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            },
            duration:1000,
            effect:2
        })
        bannerTip();
    }

})();











