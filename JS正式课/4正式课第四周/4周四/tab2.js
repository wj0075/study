function MyTab(id,url,duration){
    this.oBox = document.getElementById('box');
    this.oBoxInner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oBox.getElementsByTagName('li');
    this.aBtnL = this.oBox.getElementsByTagName('a')[0];
    this.aBtnR = this.oBox.getElementsByTagName('a')[1];
    this.aImg = this.oBox.getElementsByTagName('img');
    this.timer = null;
    this.n=0;
    this.data = null;
    this.init();
}
MyTab.prototype = {
  constructor:MyTab,
    init:function(){//思路步骤.所有函数的思路调用
        //1.获取数据并解析数据
        var _this = this;
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延时加载
        setInterval(function(){
            _this.lazyImg();
        },500);
        this.lazyImg();
        //4.自动轮播图片
        _this.timer=setInterval(function(){
            _this.autoMove();
        },2000);
        //5.焦点轮播
        this.bannerTip();
        //6.鼠标移入移出
        this.overout();
        //7.点击焦点手动切换
        this.handleChane();
        //8.左右手动切换
       this.leftRight();
    },
    getData:function  getData(){
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get','data.txt',false);
        xml.onreadystatechange = function(){
            if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind:function bind(){
        var strDiv = '';
        var strLi = '';
        for (var i=0;i<this.data.length;i++){
            strDiv+='<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""></div>';
        this.oBoxInner.innerHTML=strDiv;
        this.oBoxInner.style.width = this.aDiv[0].offsetWidth*this.aDiv.length+'px';
        this.oUl.innerHTML = strLi;
    },
    lazyImg:function lazyImg(){
        var _this = this;
        for (var i=0;i<this.aImg.length;i++){
            ~function(index){
                var cur = _this.aImg[index];
                var tmpImg = new Image;
                tmpImg.src = cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src = this.src;
                    tmpImg = null;
                }
            }(i)
        }
    },
    autoMove:function autoMove(){
        if (this.n>=this.aDiv.length-1){
            this.n=0;
            utils.css(this.oBoxInner,'left',-this.n*1000)
        }
        this.n++;
        animate({
            id:this.oBoxInner,
            target:{
                left:-this.n*1000
            }
        });
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        var tmp = this.n>=this.aLi.length?0:this.n;
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==tmp?'on':null
        }
    },
    overout:function(){
        var _this=this;
        _this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.aBtnL.style.display = _this.aBtnR.style.display = 'block';
        };
        _this.oBox.onmouseout=function(){
            _this.timer = window.setInterval(function(){
                _this.autoMove();
            },2000);
            _this.aBtnL.style.display = _this.aBtnR.style.display = 'none';
        };

    },
    handleChane:function(){
        var _this = this;
        ~function(){
            for (var i=0;i<_this.aLi.length;i++){
                _this.aLi[i].index=i;
                _this.aLi[i].onclick=function(){
                    _this.n=this.index;
                    animate({
                        id:_this.oBoxInner,
                        target:{
                            left:-_this.n*1000
                        }
                    });
                    _this.bannerTip();
                }
            }

        }();
    },
    leftRight:function leftRight(){
        var _this=this;
        this.aBtnR.onclick=function(){
            _this.autoMove();
        };
        this.aBtnL.onclick = function(){
            if ( _this.n<=0){
                _this.n= _this.aDiv.length-1;
                utils.css( _this.oBoxInner,'left',-_this.n*1000)
            }

            _this.n--;
            animate({
                id: _this.oBoxInner,
                target:{
                    left:- _this.n*1000
                }
            });
            _this.bannerTip();
        }
    }

};