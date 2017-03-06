/**
 * Created by 39753 on 2016/11/20.
 */
(function(){
    //1.获取并解析数据 2.绑定数据 3.延迟加载 4.图片渐隐渐现 5.焦点自动轮播 6.鼠标移入停止，移出继续 7.点击焦点手动切换 8.点击左右按钮手动切换
    var oBox=document.getElementById('box');
    var oBoxInner=oBox.getElementsByTagName('div')[0];
    var aDiv=oBoxInner.getElementsByTagName('div');
    var oUl=oBox.getElementsByTagName('ul')[0];
    var aLi=oBox.getElementsByTagName('li');
    var aImg=oBox.getElementsByTagName('img');
    var oBtnLeft=oBox.getElementsByTagName('a')[0];
    var oBtnRight=oBox.getElementsByTagName('a')[1];
    var data=null;
    var n=0;
    var timer=null;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send(null);
    }
    //2.绑定数据
    bind();
    function bind(){
        var strDiv='';
        var strLi='';
        for(var i=0; i<data.length; i++){
            strDiv+='<div><img src="" realImg="'+data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        oBoxInner.innerHTML=strDiv;
        oUl.innerHTML=strLi;
    }
    //3.延迟加载并且渐隐渐现第一张图片
    lazyImg();
    function lazyImg(){
        for(var i=0; i<aImg.length; i++){
            (function(index){
                var cur=aImg[index];
                var tmpImg=new Image;
                tmpImg.src=cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src=this.src;
                    tmpImg=null;
                    utils.css(aDiv[0],'zIndex',1);
                    animate({
                        id:aDiv[0],
                        target:{
                            opacity:1
                        }
                    })
                }
            })(i);
        }
    }
    //4.图片渐隐渐现
    timer=setInterval(autoMove,2000);
    function autoMove(){
        if(n>=aDiv.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function setBanner(){
        //第几张图片的索引等于n，就让第几张图片的层级提高（让其他图片的层级为0）；让层级最高的这个图片透明度从0-1；（让他的兄弟元素透明度为0）；
        for(var i=0; i<aDiv.length; i++){
            if(i==n){//要显示的图片
                utils.css(aDiv[i],'zIndex',1);
                animate({
                    id:aDiv[i],
                    target:{
                        opacity:1
                    },
                    callback:function(){
                        var siblings=utils.siblings(this);//aDiv[i]
                        for(var i=0; i<siblings.length; i++){
                            utils.css(siblings[i],'opacity',0);
                        }
                    }
                })
            }else{
                utils.css(aDiv[i],'zIndex',0);
            }
            bannerTip();
        }
    }
    //5.焦点自动轮播
    function bannerTip(){
        for(var i=0; i<aLi.length; i++){
            aLi[i].className=i==n?'on':null;
        }
    }
    //6.鼠标移入停止，移出继续
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
                aLi[index].onclick=function(){
                    n=index;
                    setBanner();
                }
            })(i);
        }
    }
    //8.点击左右按钮手动切换
    oBtnRight.onclick=autoMove;
    oBtnLeft.onclick=function(){
        if(n<=0){
            n=aDiv.length;
        }
        n--;
        setBanner();
    }
})();










