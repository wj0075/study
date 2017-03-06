/**
 * Created by wj007 on 2016/11/20.
 */
function Tab(id,url){
    this.url=url;
    this.$oBox = $(id);
    this.$oBoxInner = this.$oBox.children('.boxInner');
    this.$aDiv = null;
    this.$aImg = null;
    this.$oUl = this.$oBox.children('ul');
    this.$aLi = null;
    this.$aBtnL = this.$oBox.children('.left');
    this.$aBtnR = this.$oBox.children('.right');
    this.n = 0;
    this.data = null;
    this.timer = null;
    this.init();
}
Tab.prototype = {
  constructor:Tab,
    init:function(){
        var that = this;
        //1.获取数据
        this.getData();
        //2.绑定数据
        this.bind();
        //3.图片延时加载
        //setTimeout(function(){//异步事件，要执行完成之后，才会执行。
            that.lazyImg();
        //},500)
        //4.图片自动轮播
        clearInterval(this.timer);
        this.timer = setInterval(function(){
            that.autoMove();
        },2000);
        //5.焦点自动轮播
        this.overout();
        //6.鼠标移入停止，移除继续
        //7.点击焦点，手动切换
        this.handleChange();
        //8.leftRight
        this.leftRight();
    },
    getData:function(){
        var that = this;
        $.ajax({
            type:'get',//获取方式
            url:this.url,//数据来源路径
            async:false,//同步还是异步
            dataType:'json',//获取的数据格式
            success:function(val){//成功获取数据
                that.data = val
            }
        })
    },
    bind:function(){
        var str = '';
        var str1 = '';
        $.each(this.data,function(index,item){
            str+='<div><img src="" realImg="'+item.imgSrc+'" alt=""></div>'
            str1+=index ==0?'<li class="on"></li>':'<li></li>';
        });
        this.$oBoxInner.html(str);
        this.$oUl.html(str1);
    },
    lazyImg:function(){
        var that = this;
        this.$aDiv = this.$oBoxInner.children('div');
        this.$aImg = this.$oBoxInner.find('img');
        this.$aLi = this.$oUl.find('li');
        $.each(this.$aImg,function(index,item){
            var tmpImg = new Image;
            tmpImg.src = item.getAttribute('realImg');
            tmpImg.onload=function(){
                item.src = this.src;
                tmpImg=null;
                var $div1 = that.$aDiv.eq(0);
                $div1.css('zIndex',1).fadeIn();
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
        var that = this;
        $.each(this.$aDiv,function(index,item){
            if (index==that.n){//这获取到的item是JS类型的元素，需要将他转换为JQuery的，才能调用JQuery的方法，可以共存但不能混淆。
                $(item).css('zIndex',1).siblings().css('zIndex',0);
                $(item).fadeIn(500,function(){
                    $(this).siblings().fadeOut();
                });
            }

        });
        this.bannderTip();
    },
    bannderTip:function(){
        var that = this;
        $.each(this.$aLi,function(index,item){
            item.className = index==that.n?'on':null;
        })

    },
    overout:function(){
        var that = this;
        this.$oBox.mouseover(function(){
            clearInterval(that.timer);
            that.$aBtnL.show();
            that.$aBtnR.show();
        });
        this.$oBox.mouseout(function(){
            that.timer = setInterval(function(){
                that.autoMove();
            },2000);
            that.$aBtnL.hide();
            that.$aBtnR.hide();
        })
    },
    handleChange:function(){

        var that = this;
        this.$aLi.click(function(){

            that.n=$(this).index();
            that.setBanner();
        })
    },
    leftRight:function(){
        var that =this;
        this.$aBtnR.click(function(){
            that.autoMove();
        });
        this.$aBtnL.click(function(){
            if (that.n<=0){
                that.n=that.$aLi.length
            }
            that.n--;
            that.setBanner();
        })
    }

};