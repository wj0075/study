/**
 * Created by wj007 on 2016/11/18.
 */
~function(){
    var oBox = document.getElementById('box');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div');
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oBox.getElementsByTagName('li');
    var aImg = oBox.getElementsByTagName('img');
    var oBtnLeft = oBox.getElementsByTagName('a')[0];
    var oBtnRight = oBox.getElementsByTagName('a')[1];
    var data = null;
    var timer = null;
    var n = 0;
    //1.获取数据
    getData();
    function getData(){
        var xml = new XMLHttpRequest();
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange = function(){
            if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
                data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    }
    bind();
    function bind(){
        var strDiv = '';
        var strLi = '';
        for (var i=0;i<data.length;i++){
            strDiv+= '<div><img src="" realImg="' + data[i].imgSrc + '" alt=""></div>';
            strLi += i == 0 ? '<li class="on"></li>' : '<li></li>';
        }
        oBoxInner.innerHTML = strDiv;
        oUl.innerHTML=strLi;
    }
    lazyImg();
    function lazyImg(){
        for (var i=0;i<aImg.length;i++){
            (function(index){
                var curImg = aImg[index];
                var tmpImg = new Image;
                tmpImg.src = curImg.getAttribute('realImg');
                tmpImg.onload=function(){
                   curImg.src = this.src;
                    tmpImg=null;
                   /* utils.css(aDiv[0],'zIndex',1);*/
                    animate({
                        id:aDiv[0],
                        target:{
                            opacity:1
                        }
                    })
                }




            })(i)
        }
    }
//4.自动
    timer = setInterval(autoMove,2000);
    function autoMove(){
        if (n>=aDiv.length-1){
            n=-1;
        }
        n++;
        setBanner();
    }
    function setBanner(){
        for (var i=0;i<aDiv.length;i++){
            if (i===n){
                utils.css(aDiv[i],{
                    zIndex:1,
                });
                animate({
                    id:aDiv[i],
                    target:{
                        opacity:1,
                    },
                    callback:function(){
                        var siblings = utils.siblings(this);
                        for (var j= 0;j<siblings.length;j++){
                            utils.css(siblings[j],'opacity',0)
                        }
                    }
                });
                continue;
            }
            utils.css(aDiv[i],'zIndex',0);
        }
    }


}();