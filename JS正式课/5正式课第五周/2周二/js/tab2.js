function Tab(id,url,duration){
    this.url = url;
    this.duration = duration||2000;
    this.$oBox = $(id);
    this.$oBoxInner = this.$oBox.find('.boxInner');
    this.$aDiv = null;
    this.$aImg = null;
    this.$oUl = this.$oBox.find('ul');
    this.$aLi = null;
    this.$aBtnL = this.$oBox.find('.left');
    this.$aBtnR = this.$oBox.find('.right');
    this.n=0;
    this.timer = null;
    this.data = null;
    this.init();
}
Tab.prototype = {
    constructor:Tab,
    init:function(){
        var _this = this;
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延时加载
        setTimeout(function(){
            _this.lazyImg();
        },500);
        //4.图片自动轮播
        this.timer = setInterval(function(){
            _this.autoMove();
        },2000);
        //5.焦点自动轮播
        //6.鼠标移入移出
        this.mouse();
        //7.点击焦点，手动切换
        this.handleChange();
        //8.左右切换
        this.leftRight();
    },
    getData:function(){
      var _this = this;
        $.ajax({
            type:'get',
            url:this.url,
            async:false,
            dataType:'json',
            success:function(val){
                _this.data =val
            }
        })
    },
    bind:function(){
        var strDiv='';
        var strLi = '';
        $.each(this.data,function(index,item){
            strDiv+='<div><img src="" realImg="'+item.imgSrc+'" alt=""></div>';
            strLi+=index==0?'<li class="on"></li>':'<li></li>';
        });
        this.$oBoxInner.html(strDiv);
        this.$oUl.html(strLi);
        this.$aDiv = this.$oBoxInner.children('div');
        this.$aImg = this.$oBoxInner.find('img');
        this.$aLi = this.$oUl.find('li');


    },
    lazyImg:function(){
        var _this = this;
        $.each(this.$aImg,function(index,item){
            var tmpImg = new  Image;
            tmpImg.src = item.getAttribute('realImg');
            tmpImg.onload=function(){
                item.src = this.src;
                tmpImg = null;
                var $div1 = _this.$aDiv.eq(0);
                $div1.css('zIndex',1).animate({opacity:1})
            }
        })


    },
    autoMove:function(){
        if (this.n>=this.$aDiv.length-1){
            this.n=-1;
        }
        this.n++;
        this.setBanner();
    },
    setBanner:function(){
        var _this = this;
        $.each(this.$aDiv,function(index,item){
            if (index==_this.n){
                $(item).css('zIndex',1).animate({opacity:1});
                $(item).siblings().css('zIndex',0).animate({opacity:0});
            }
            _this.bannerTip();
        })
    },
    bannerTip:function(){
        var _this = this;
        $.each(this.$aLi,function(index,item){
                item.className = _this.n==index?'on':null;
        })
    },
    mouse:function(){
        var _this = this;
        this.$oBox.mouseover(function(){
            clearInterval(_this.timer);
            _this.$aBtnL.show();
            _this.$aBtnR.show();

        });
        this.$oBox.mouseout(function(){
            _this.timer = setInterval(function(){
                _this.autoMove();
            },2000);
            _this.$aBtnL.hide();
            _this.$aBtnR.hide()
            ;
        })

    },
    handleChange:function(){
        var _this =this;
        this.$aLi.click(function(){
            _this.n=$(this).index();
            _this.setBanner();
        })

    },
    leftRight:function(){
        var _this = this;
        this.$aBtnR.click(function(){
            _this.autoMove();
        });
        this.$aBtnL.click(function(){
            if (_this.n<=0){
                _this.n=_this.$aLi.length;
            }
            _this.n--;
            _this.setBanner();
        })
    }

};