/**
 * Created by 39753 on 2016/11/17.
 */
function MyTab(){
    this.oBox = document.getElementById('box');
    this.oBoxInner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oBox.getElementsByTagName('li');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oBtnLeft = this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight = this.oBox.getElementsByTagName('a')[1];
    this.data = null;
    this.timer=null;
    this.n=0;
    this.init();
}
MyTab.prototype={
    constructor:MyTab,
    init:function(){
        var _this=this;
        //1.获取并解析数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延迟加载
        setTimeout(function(){
            _this.lazyImg();
        },500);
        //4.图片自动轮播
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.autoMove();
        },2000);
        //6.移入停止移出继续
        this.overout();
        //7.点击焦点手动切换
        this.handleChange();
        //8.点击左右按钮进行切换；
        this.leftRight();
    },
    getData:function getData() {
        var _this=this;
        var xml = new XMLHttpRequest;
        xml.open('get', 'json/data.txt', false);
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function bind(){
        var strDiv="";
        var strLi='';
        for(var i=0; i<this.data.length; i++){
            strDiv+='<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""></div>';
        this.oBoxInner.innerHTML=strDiv;
        this.oBoxInner.style.width=this.aDiv[0].offsetWidth*this.aDiv.length+'px';
        this.oUl.innerHTML=strLi;
    },
    lazyImg:function lazyImg(){
        var _this=this;
        for(var i=0; i<this.aImg.length; i++){
            (function(index){
                var cur=_this.aImg[index];
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
    },
    autoMove:function autoMove(){
        if(this.n>=this.aDiv.length-1){
            this.n=0;
            utils.css(this.oBoxInner,'left',-this.n*1000);
        }
        this.n++;
        // utils.css(oBoxInner,'left',-n*1000);
        animate({
            id:this.oBoxInner,
            target:{
                left:-this.n*1000
            },
            duration:1000,
            effect:2
        })
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        var tmp=this.n>=this.aLi.length?0:this.n;
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].className=i==tmp?'on':null;
        }
    },
    overout:function(){
        var _this=this;
        _this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='block';
        };
        _this.oBox.onmouseout=function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },2000);
            _this.oBtnLeft.style.display=_this.oBtnRight.style.display='none';
        };
    },
    handleChange:function handleChange(){
        var _this=this;
        for(var i=0; i<this.aLi.length; i++){
            (function(index){
                _this.aLi[i].onclick=function(){
                    _this.n=index;
                    animate({
                        id:_this.oBoxInner,
                        target:{
                            left:-_this.n*1000
                        },
                        duration:1000,
                        effect:2
                    });
                    _this.bannerTip();
                }
            })(i);
        }
    },
    leftRight:function(){
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        this.oBtnLeft.onclick=function(){
            if(_this.n<=0){
                _this.n=_this.aDiv.length-1;
                utils.css(_this.oBoxInner,'left',-_this.n*1000);
            }
            _this.n--;
            animate({
                id:_this.oBoxInner,
                target:{
                    left:-_this.n*1000
                },
                duration:1000,
                effect:2
            });
            _this.bannerTip();
        }
    }
};









