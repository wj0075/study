function MyTab (id,url,duration){
    this.url = url;
    this.duration = duration||2000;
    this.oBox = document.getElementById(id);
    this.oBoxInner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aImg = this.oBoxInner.getElementsByTagName('img');
    this.aLi = this.oUl.getElementsByTagName('li');
    this.aBtnL = this.oBox.getElementsByTagName('a')[0];
    this.aBtnR = this.oBox.getElementsByTagName('a')[1];
    this.data = null;
    this.n=0;
    this.timer = null;
    this.init();

}
MyTab.prototype={
    constructor:MyTab,
    init:function(){
        var _this = this;
        //获取数据
        this.getData();
        //绑定数据
        this.bind();
        //图片延时加载

        setTimeout(function(){
            _this.lazyImg();
        },500);
        //图片自动轮播
        this.timer = setInterval(function(){
            _this.autoMove();
        },2000);
        //焦点轮播
        this.mouse();
        //鼠标移出移除
        this.handleChange();
        //点击焦点手动切换
        this.leftRight();
        //点击左右按钮
    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest();
        xml.open('get',this.url,false);
        xml.onreadystatechange = function(){
            if (xml.readyState ===4&&/^2\d{2}$/.test(xml.status)){
                _this.data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    },
    bind:function(){
        var str1 = '';
        var str2 = '';
        for (var i=0;i<this.data.length;i++){
            str1 += '<div><img src="" realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            str2+=i==0?'<li class="on"></li>':'<li></li>';
        }
        str1+='<div><img src="" realImg="'+this.data[0].imgSrc+'" alt=""></div>';
        this.oBoxInner.innerHTML = str1;
        this.oBoxInner.style.width = this.aDiv[0].offsetWidth*this.aDiv.length+'px';
        this.oUl.innerHTML = str2;
    },
    lazyImg:function(){
        var _this = this;
        for (var i=0;i<this.aImg.length;i++){
            ~function(i){
                var cur = _this.aImg[i];
                var tmpImg = new Image;
                tmpImg.src = cur.getAttribute('realImg');
                tmpImg.onload = function(){
                    cur.src = this.src;
                    tmpImg = null;
                };
                tmpImg.onerror=function(){
                    cur.parentNode.style.background = 'url("img/default.gif") no-repeat center #ccc';
                }
            }(i)
        }

    },
    autoMove:function() {
        if (this.n>=this.aDiv.length-1){
            this.n=0;
            utils.setCss(this.oBoxInner,'left',-this.n*1000)
        }
        this.n++;
        animate({
            id:this.oBoxInner,
            target:{
                left:-this.n*1000
            }
        })
        this.bannerTip();


    },
    bannerTip:function(){
        var tmp = this.n==this.aDiv.length-1?0:this.n;
        for (var i = 0;i<this.aLi.length;i++){
                this.aLi[i].className = i==tmp?'on':null;
        }
    },
    mouse:function(){
        var _this =this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.timer);
            _this.aBtnL.style.display = _this.aBtnR.style.display='block';
        };
        this.oBox.onmouseout=function(){
            _this.timer = setInterval(function(){
                _this.autoMove();
            },2000)
            _this.aBtnL.style.display = _this.aBtnR.style.display='none';
        }
    },
    handleChange:function(){
        var _this=this;
        for (var i=0;i<this.aLi.length;i++){
            this.aLi[i].tmp = i;
            this.aLi[i].onclick = function(){
                _this.n=this.tmp;
                animate({
                    id:_this.oBoxInner,
                    target:{
                        left:-_this.n*1000
                    }
                });
                _this.bannerTip();
            }
        }
    },
    leftRight:function(){
        var _this=this;
        this.aBtnR.onclick = function(){
            _this.autoMove();
        };
        this.aBtnL.onclick=function(){
            if (_this.n<=0){
                _this.n=_this.aLi.length;
                utils.setCss(_this.oBoxInner,'left',-_this.n*1000)
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