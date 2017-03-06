function yiBo(id,url){
    this.url = url;
    this.oBox = document.getElementById(id);
    this.aUl = this.oBox.getElementsByTagName('ul');
    this.aLi = this.oBox.getElementsByTagName('li');
    this.aImg = this.oBox.getElementsByTagName('img');
    this.toTop = this.oBox.getElementsByTagName('a')[0];
    this.timer = null;
    this.flag = false;
    this.data = null;
    this.init();
}
yiBo.prototype = {
    constructor: yiBo,
    init:function(){
        //1.获取数据
        var _this = this;
        this.getData();

        //2.创建一个Li
        //3.创建40个li
        this.li40();
        //4.图片延时加载
        this.showImg();
        //5.瀑布流
        window.onscroll =function(){
            _this.scroll();
        };
        //6.回到顶部
        this.toTop.onclick = function(){
            _this.goTop();
        }
    },
    getData:function(){
        var _this = this;
        var xml = new XMLHttpRequest();
        xml.open('get',this.url,false);
        xml.onreadystatechange = function(){
            if (xml.readyState==4&&/^2\d{2}$/.test(xml.status)){
               _this. data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();

    },
    createLi:function(){
        var oLi = document.createElement('li');
        oLi.innerHTML='<img src="" realImg="'+this.data[utils.rnd(0,23)].imgSrc+'" alt="">';
        oLi.style.height = utils.rnd(140,240)+'px';
        return oLi;
    },
    li40:function(){
        for (var i=0;i<40;i++){
            var oLi = this.createLi();
            var ary = utils.makeArray(this.aUl);
            ary.sort(function(a,b){
                return a.offsetHeight-b.offsetHeight
            });
            ary[0].appendChild(oLi);
        }
    },
    showImg:function(){
        var scrollBottom=utils.win('scrollTop')+utils.win("clientHeight");
        for (var i=0;i<this.aImg.length;i++){
            var imgPos = this.aImg[i].offsetTop+this.aImg[i].offsetHeight;
            if (imgPos<=scrollBottom){
                this.lazyImg(this.aImg[i]);
            }
        }
    },
    lazyImg:function(img){
        if (img.loaded) return;
        var tmpImg = new Image;
        tmpImg.src = img.getAttribute('realImg');
        tmpImg.onload=function(){
            img.src = this.src;
            tmpImg = null;
            img.parentNode.style.height = img.offsetHeight+'px';
            img.loaded = true;
        };
        tmpImg.onerror=function(){
            img.parentNode.style.background = 'url("images/default.gif") no-repeat center #ccc'
            tmpImg = null;
            img.loaded = true;
        }
    },
    scroll:function(){
        var _this = this;
        if (this.flag) clearInterval(this.timer);
        this.flag = true;
        var scrollBottom = utils.win('scrollTop')+utils.win('clientHeight');
        if (utils.win('clientHeight')<=utils.win('scrollTop')){
            _this.toTop.style.display = 'block';
        }else {
            _this.toTop.style.display = 'none';
        }
        _this.showImg();
        if (document.body.scrollHeight-20<=scrollBottom){
            _this.li40();
        }
    },
    goTop:function(){
        var _this = this;
        var target = utils.win('scrollTop');
        var duration = 300;
        var interval = 30;
        var step = target/duration*interval;
        this.timer = setInterval(function(){
            var curTop = utils.win('scrollTop');
            if (curTop<=0){
                clearInterval(_this.timer)
                return;
            }

            curTop-=step;
            utils.win('scrollTop',curTop)
            _this.flag =false;
        },interval)
    }

};