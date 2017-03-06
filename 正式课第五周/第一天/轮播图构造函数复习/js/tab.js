/**
 * Created by 39753 on 2016/11/22.
 */
function Tab(opt){
    if(!opt.id) return;//当ID没有传的话，不执行任何程序
    this.default={
        url:'json/data.txt',
        duration:2000,
        effect:0
    };
    for(var attr in opt){
        this.default[attr]=opt[attr];
    }
    //把全局变量，都作为私有属性写在构造函数中
    this.$box=$('#'+this.default.id);
    this.$boxInner=this.$box.find('.boxInner');
    this.$aDiv=null;//jquery没有DOM映射
    this.$aImg=null;//find:子子孙孙
    this.$ul=this.$box.children('ul');
    this.$aLi=null;
    this.$left=this.$box.find('.left');
    this.$right=this.$box.find('.right');
    this.data=null;
    this.n=0;
    this.timer=null;
    this.init();
}
Tab.prototype={
    constructor:Tab,
    init:function(){
        var _this=this;
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.延迟加载+第一张图片显示
        this.lazyImg();
        //4.图片渐隐渐现
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.autoMove();
        },this.default.duration)
        //5.焦点自动轮播
        //6.鼠标移入停止移出继续
        this.overout();
        //7.点击焦点手动切换
        this.handleChange();
        //8.点击左右按钮切换
        this.leftRight();
    },
    getData:function(){
        //jquery获取数据：$.ajax();
        var _this=this;
        $.ajax({//type,url,async,dataType,success  如果前端需要向后台传递数据：data
            type:'GET',
            url:_this.default.url,
            async:false,//同步
            dataType:'json',
            success:function(val){
                _this.data=val;
            }
        })
    },
    bind:function(){
        //遍历数据：$.each(对象,callback);
        var strDiv='';
        var strLi='';
        $.each(this.data,function(index,item){
            strDiv+='<div><img src="" realImg="'+item.imgSrc+'" alt=""></div>';
            strLi+=index==0?'<li class="on"></li>':'<li></li>';
        })
        this.$boxInner.html(strDiv);
        this.$ul.html(strLi);
        this.$aDiv=this.$boxInner.children('div');
        this.$aImg=this.$boxInner.find('img');
        this.$aLi=this.$ul.children('li');
    },
    lazyImg:function(){
        var _this=this;
        $.each(this.$aImg,function(index,item){
            var tmpImg=new Image;
            tmpImg.src=$(item).attr('realImg');
            tmpImg.onload=function(){
                $(item).attr('src',tmpImg.src);
                tmpImg=null;
                _this.$aDiv.first().css('zIndex',1).animate({opacity:1})
            }

        })
    },
    autoMove:function(){
        if(this.n>=this.$aDiv.length-1){
            this.n=-1;
        }
        this.n++;
        this.setBanner();
    },
    setBanner:function(){
        var _this=this;
        $.each(this.$aDiv,function(index,item){
            if(index==_this.n){
                $(item).css('zIndex',1).siblings().css('zIndex',0);
                $(item).animate({opacity:1},function(){
                    $(item).siblings().animate({opacity:0});
                })
            }
        })
        this.bannerTip();
    },
    bannerTip:function(){
        var _this=this;
        $.each(this.$aLi,function(index,item){
            item.className=index==_this.n?'on':null;
            /*if(index==_this.n){
                $(item).addClass('on');
            }else{
                $(item).removeClass('on');
            }*/
        })
    },
    overout:function(){
        var _this=this;
        this.$box.mouseover(function(){
            clearInterval(_this.timer);
            /*_this.$left[0].style.display=_this.$right[0].style.display='block';*/
            _this.$left.show();
            _this.$right.show();
        });
        this.$box.mouseout(function(){
            _this.timer=setInterval(function(){
                _this.autoMove();
            },_this.default.duration);
            _this.$left.hide();
            _this.$right.hide();
        })
    },
    handleChange:function(){
        var _this=this;
        this.$aLi.click(function(){
            _this.n=$(this).index();
            _this.setBanner();
        })
    },
    leftRight:function(){
        var _this=this;
        this.$right.click(function(){
            _this.autoMove();
        })
        this.$left.click(function(){
            if(_this.n<=0){
                _this.n=_this.$aDiv.length;
            }
            _this.n--;
            _this.setBanner();
        })
    }

}