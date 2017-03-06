/**
 * Created by wj007 on 2016/11/17.
 */
~function(){
    var oBox = document.getElementById('box');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div');
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oBox.getElementsByTagName('li');
    var aBtnL = oBox.getElementsByTagName('a')[0];
    var aBtnR = oBox.getElementsByTagName('a')[1];
    var aImg = oBox.getElementsByTagName('img');
    var timer = null;
    var n=0;
    var data = null;
    //oBoxInner.innerHTML +='<div><img src="images/banner1.jpg" alt=""></div>';
    //oBoxInner.style.width = aDiv[0].offsetWidth*aDiv.length+'px';
    //获取数据
    getData();
    function getData(){
        var xml = new XMLHttpRequest();
        xml.open('get','data.txt',false);
        xml.onreadystatechange = function(){
            if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
                data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    }
    //绑定数据
    bind();
    function bind(){
        var strDiv = '';
        var strLi = '';
        for (var i=0;i<data.length;i++){
            console.log('ok');
            strDiv+='<div><img src="" realImg="'+data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+data[0].imgSrc+'" alt=""></div>';
        oBoxInner.innerHTML=strDiv;
        oBoxInner.style.width = aDiv[0].offsetWidth*aDiv.length+'px';
        oUl.innerHTML = strLi;
    }
    console.log(aImg.length);
    setInterval(lazyImg,500);
    function lazyImg(){

        for (var i=0;i<aImg.length;i++){
            console.log('ss');
            ~function(index){
                var cur = aImg[index];
                var tmpImg = new Image;
                tmpImg.src = cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src = this.src;
                    tmpImg = null;
                }
            }(i)
        }
    }
    clearInterval(timer);
    timer = window.setInterval(autoMove,2000);
    function autoMove(){
        if (n>=aDiv.length-1){
            n=0;
            utils.css(oBoxInner,'left',-n*1000)
        }
        n++;
        animate({
            id:oBoxInner,
            target:{
                left:-n*1000
            }
        });
        bannerTip();
    }
    function bannerTip(){
        var tmp = n>=aLi.length?0:n;
        for (var i=0;i<aLi.length;i++){
            aLi[i].className=i==tmp?'on':null
        }
    }
    oBox.onmouseover=function(){
        clearInterval(timer);
        aBtnL.style.display = aBtnR.style.display = 'block';
    };
    oBox.onmouseout=function(){
        timer = window.setInterval(autoMove,2000);
        aBtnL.style.display = aBtnR.style.display = 'none';
    };
    ~function(){
        for (var i=0;i<aLi.length;i++){
            aLi[i].index=i;
            aLi[i].onclick=function(){
                n=this.index;
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
    aBtnR.onclick=autoMove;
    aBtnL.onclick = function(){
        if (n<=0){
            n=aDiv.length-1;
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