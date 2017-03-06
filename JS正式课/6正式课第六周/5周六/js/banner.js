function Banner(id,url,duration){
    this.url = url;
    this.duration = duration||2000;
    this.oBox = document.getElementById(id);
    this.oBoxBanner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxBanner.getElementsByTagName('div');
    this.aImg = this.oBoxBanner.getElementsByTagName('img');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oUl.getElementsByTagName('li');
    this.aBtnL = this.oBox.getElementsByTagName('a')[0];
    this.aBtnR = this.oBox.getElementsByTagName('a')[1];
    this.data = null;
    this.n = 0;
    this.timer = null;
    this.init();
}
Banner.prototype={
    init:function(){
        var _this= this;
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延时加载
        this.lazyImg();
        //4.图片轮播
        this.timer = setInterval(function(){
            _this.autoMove();
        },2000);
        //5.焦点自动轮播
        //6.鼠标移入暂停移除继续
        this.mouse();
        //7.点击焦点图片轮播
        this.handleChane();
        //8.点击左右按钮轮播
        this.leftRight();
    },
    getData:function(){
        var _this=this;
        var xml = new XMLHttpRequest();
        xml.open('get',this.url,false);
        xml.onreadystatechange=function(){
            if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function(){
        var strDiv = '';
        var strLi = '';
        for (var i=0;i<this.data.length;i++){
            strDiv+='<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        strDiv+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""></div>';
        this.oBoxBanner.innerHTML=strDiv;
        this.oBoxBanner.style.width = this.aDiv[0].offsetWidth*this.aDiv.length+'px';
        this.oUl.innerHTML = strLi;
    },
    lazyImg:function(){
        var _this=this;
        for (var i=0;i<this.aImg.length;i++){
            ~function(i){
                var cur = _this.aImg[i];
                var tmpImg = new Image;
                tmpImg.src = cur.getAttribute('realImg');
                tmpImg.onload=function(){
                    cur.src = this.src;
                    tmpImg=null;
                }
            }(i)
        }
    },
    autoMove:function(){
        if (this.n>=this.aLi.length){
            this.n=0;
            utils.css(this.oBoxBanner,'left',-this.n*1000)
        }
        this.n++;
        animate({
            id:this.oBoxBanner,
            target:{
                left:-this.n*1000
            }
        });
        console.log(this.n);
        this.setBanner();
    },
    setBanner:function(){
        this.m = this.n>=this.aLi.length?0:this.n;
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].className=i==this.m?'on':null;
        }
    },
    mouse:function(){
        var _this = this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.aBtnL.style.display='block';
            _this.aBtnR.style.display='block';
        };
        this.oBox.onmouseleave = function(){
            _this.timer = setInterval(function(){
                _this.autoMove();
            },2000);
            _this.aBtnL.style.display='none';
            _this.aBtnR.style.display='none';
        }
    },
    handleChane:function(){
        var _this = this;
        for (var i=0;i<this.aLi.length;i++){
            ~function(i){
                var cur = _this.aLi[i];
                cur.onclick = function(){
                    _this.n=i;
                    animate({
                        id:_this.oBoxBanner,
                        target:{
                            left:-_this.n*1000
                        }
                    });
                    _this.setBanner();
                }
            }(i)

        }


    },
    leftRight:function(){
        var _this=this;
        this.aBtnR.onclick=function(){
            _this.autoMove();
        };
        this.aBtnL.onclick=function(){
            if (_this.n<=0){
                _this.n=_this.aLi.length;
                utils.css(_this.oBoxBanner,'left',-_this.n*1000)
            }
            _this.n--;
            animate({
                id:_this.oBoxBanner,
                target:{
                    left:-_this.n*1000
                }
            });
            _this.setBanner();
        }
    }
};