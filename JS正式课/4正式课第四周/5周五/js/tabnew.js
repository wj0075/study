function MyTabNew(id, url, duration) {
    this.url = url;
    this.duration = duration;
    this.oBox = document.getElementById(id);
    this.oBoxInner = utils.getByClass('boxInner', this.oBox)[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oUl.getElementsByTagName('li');
    this.aBtnL = this.oBox.getElementsByTagName('a')[0];
    this.aBtnR = this.oBox.getElementsByTagName('a')[1];
    this.aImg = this.oBoxInner.getElementsByTagName('img');
    this.n = 0;
    this.timer = null;
    this.data = null;
    this.init();
}
MyTabNew.prototype = {
    constructor: MyTabNew,
    init: function () {
        var _this = this
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();

        //3.图片延时加载
        setTimeout(function () {
            _this.lazyImg();
        }, 200);
        //4.图片自动轮播
        this.timer = setInterval(function(){
            _this.autoMove();
        },2000);
        //5.焦点自动轮播
        //6.鼠标移出开始，鼠标移入停止
        this.overout();
        //7.点击焦点，手动切换
        this.handleChane();
        //8.左右切换
        this.leftRight();
    },
    getData: function () {
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get', this.url, false);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && /^2\d{2}$/.test(xml.status)) {
                _this.data = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind: function () {
        var strDiv = '';
        var strLi = '';
        for (var i = 0; i < this.data.length; i++) {
            strDiv += '<div><img src="" realImg="' + this.data[i].imgSrc + '" alt=""></div>';
            strLi += i == 0 ? '<li class="on"></li>' : '<li></li>';
        }
        this.oBoxInner.innerHTML = strDiv;
        this.oUl.innerHTML = strLi;
    },
    lazyImg: function () {
        var _this = this;
        for (var i = 0; i < this.aImg.length; i++) {
            ~function (i) {
                var cur = _this.aImg[i];
                var tmpImg = new Image;
                tmpImg.src = cur.getAttribute('realImg');
                tmpImg.onload = function () {
                    cur.src = this.src;
                    tmpImg = null;
                    utils.css(_this.aImg[0].parentNode,'zIndex',1);
                    animate({
                        id: _this.aImg[0].parentNode,
                        target: {
                            opacity: 1
                        }
                    })

                }


            }(i)
        }
    },
    autoMove:function(){

        if (this.n>=this.aDiv.length-1){

            this.n=-1;
        }
        this.n++;
        this.setBanner();


    },
    setBanner:function(){
        for (var i=0;i<this.aDiv.length;i++){
            if (i==this.n){
                utils.css(this.aDiv[i],{
                    zIndex:1
                });
                animate({
                    id:this.aDiv[i],
                    target:{
                        opacity:1,
                        },
                    callback:function(){
                        var siblingsa = utils.siblings(this);
                        for (var j=0;j<siblingsa.length;j++){
                            utils.css(siblingsa[j],'opacity',0);
                    }
                    }
                });
            }else {
                utils.css(this.aDiv[i],'zIndex',0)

            }

            this.bannerTip();
        }
    },
    bannerTip:function() {
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].className = i==this.n?'on':null;
        }
    },
    overout:function(){
        var _this = this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.aBtnL.style.display = _this.aBtnR.style.display = 'block';
        };
        this.oBox.onmouseout = function(){
          _this.timer = setInterval(function(){
              _this.autoMove();
          },2000)
            _this.aBtnL.style.display = _this.aBtnR.style.display = 'none';
        }
    },
    handleChane:function(){
        var _this = this;
        for (var i=0;i<this.aLi.length;i++){
            ~function(i){
                _this.aLi[i].onclick = function(){
                    _this.n=i;
                    _this.setBanner();
                }


            }(i);

        }

    },
    leftRight:function(){
        var _this=this;
        this.aBtnR.onclick=function(){
            _this.autoMove();
        };
        this.aBtnL.onclick=function(){
            if (_this.n<=0){
                _this.n = _this.aDiv.length
            }
            _this.n--;
            _this.setBanner();
        }


    }
};











