var oBox=document.getElementById('box');
var oBoxInner = utils.getByClass('boxInner',oBox)[0];
var aDiv = oBoxInner.getElementsByTagName('div');
var oUl = oBox.getElementsByTagName('ul')[0];
var aLi = oUl.getElementsByTagName('li');
var aImg = oBoxInner.getElementsByTagName('img');
var aBtnL = oBox.getElementsByTagName('a')[0];
var aBtnR = oBox.getElementsByTagName('a')[1];
var n = 0;
var timer = null;


//1.Ajax读取数据
var jsonData = null;
~function (){
    var xml=new XMLHttpRequest();
    xml.open('get','data.txt',false);
    xml.onreadystatechange =function(){
        if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
            jsonData = utils.jsonParse(xml.responseText);
        }
    };
    xml.send();
}();
console.log(jsonData);
//2.数据绑定
~function(){
    var str = '';
    var str1 = '';
    for(var i=0;i<jsonData.length;i++){
        str+='<div><img src="" realImg="'+jsonData[i].imgSrc+'" alt=""></div>'
        str1+=i==0?'<li class="on"></li>':'<li></li>';
    }
    oBoxInner.innerHTML = str;
    oUl.innerHTML = str1;
}();
//3.图片的延迟加载
setTimeout(lazyImg,500);
function lazyImg(){
    for (var i=0;i<aImg.length;i++){
        ~function(i){
            var cur = aImg[i];
            var tmpImg = new Image;
            tmpImg.src = cur.getAttribute('realImg');
            tmpImg.onload=function(){
                cur.src = this.src;
                if (i==0){
                    var curDiv = cur.parentNode;
                    curDiv.style.zIndex = 1;
                    animate({
                        id:curDiv,
                        target:{
                            opacity:1
                        }
                    })
                }
                tmpImg = null;
            }
        }(i)
    }
};


//4.自动轮播
timer=setInterval(autoMove,3000);
function autoMove(){
    if (n===3){
        n=-1;
    }
    n++;
    setBanner()
}
function setBanner(){
    for (var i=0;i<aDiv.length;i++){
        var curDiv = aDiv[i];
        if (i===n){
            utils.css(curDiv,'zIndex',1);
            animate({
                id:curDiv,
                target:{
                    opacity:1,
                },
                callback:function(){
                    var curDivSib = utils.siblings(this);
                    for (var k=0;k<curDivSib.length;k++){
                        utils.css(curDivSib[k],'opacity',0);
                    }
                }
            });

            continue;
        }
        utils.css(curDiv,'zIndex',0)
    }
}






