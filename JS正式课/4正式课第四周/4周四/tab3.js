/**
 * Created by wj007 on 2016/11/17.
 */
function MyTap(id, url, duration) {
    this.url = url;
    this.duration = duration;
    this.oBox = document.getElementById(id);
    this.oBoxInner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oBox.getElementsByTagName('li');
    this.aBtnL = this.oBox.getElementsByTagName('a')[0];
    this.aBtnR = this.oBox.getElementsByTagName('a')[1];
    this.aImg = this.oBox.getElementsByTagName('img');
    this.timer = null;
    this.n = 0;
    this.init();
}
MyTap.prototype = {
    constructor: MyTap,
    init: function () {
        var _this = this;
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延时加载
         setInterval(function(){
            _this.lazyImg();
        },500);
        //4.图片自动轮播
        this.timer = setInterval(function(){
            _this.autoMove();
        },2000);
        //5.焦点自动轮播

        //6.移入移出
        this.overout();
        //7.点击焦点手动切换
        this.handleChange();
        //8.点击左右按钮手动轮播
        this.leftRight();

    },
    getData: function getData() {
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get', _this.url, false);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && /^2\d{2}$/.test(xml.status)) {
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind: function bind() {
        var strDiv = '';
        var strLi = '';
        for (var i = 0; i < this.data.length; i++) {
            strDiv += '<div><img src="" realImg="' + this.data[i].imgSrc + '" alt=""></div>';
            strLi += i == 0 ? '<li class="on"></li>' : '<li></li>';
        }
        strDiv += '<div><img src="" realImg="' + this.data[0].imgSrc + '" alt=""></div>';
        this.oBoxInner.innerHTML = strDiv;
        this.oUl.innerHTML = strLi;
        this.oBoxInner.style.width = this.aDiv[0].offsetWidth * this.aDiv.length + 'px';
        console.log(this.oBoxInner.style.width);
    },
    lazyImg: function lazyImg() {
        var _this = this;
        for (var i = 0; i < _this.aImg.length; i++) {
            //_this.aImg[i].index = i;
            var tmpImg = new Image;
            tmpImg.index = i;
            tmpImg.src = _this.aImg[i].getAttribute('realImg');
            tmpImg.onload = function () {
                _this.aImg[this.index].src = this.src;
                tmpImg = null;
            };
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
    bannerTip:function(){
        var tmp = this.n>=this.aLi.length?0:this.n;
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==tmp?'on':null;
        }
    },
    overout:function overout(){
        var _this = this;
        this.oBox.onmouseover = function(){
            clearInterval(_this.timer);
            _this.aBtnL.style.display = _this.aBtnR.style.display ='block';
        };
        this.oBox.onmouseout=function(){
            _this.timer = setInterval(function(){
                _this.autoMove();
            },2000);
            _this.aBtnL.style.display = _this.aBtnR.style.display = 'none';
        }
    },
    handleChange:function handleChange(){
        var _this = this;
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].n = i;
            this.aLi[i].onclick=function(){
                _this.n=this.n;
                animate({
                    id:_this.oBoxInner,
                    target:{
                        left:-this.n*1000
                    }
                });
                _this.bannerTip();
            };

        }

    },
    leftRight:function leftRight(){
        var _this = this;
        this.aBtnR.onclick=function(){
            _this.autoMove();
        };
        this.aBtnL.onclick=function(){
            if (_this.n<=0){
                _this.n=_this.aLi.length;
                utils.css(_this.oBoxInner,'left',-_this.n*1000)
            }
            _this.n--;
            animate({
                id:_this.oBoxInner,
                target:{
                    left:-_this.n*1000
                }
            });
            _this.bannerTip();
        }
    }
};
