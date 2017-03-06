function Goup(opt){
    if (!opt.id) return;
    this.default = {
        duration:1000
    };
    for (var key in opt){
        this.default[key] = opt[key];
    }
    this.$go = $('#'+this.default.id);
    this.timer = null;
    this.init();
}
Goup.prototype={
    constructor:Goup,
    init:function(){
        this.goto();
        this.showHide();
    },
    goto:function(){
        var _this = this;
       _this.$go.click(function(){
           //_this.$go.hide();
           //clearInterval(_this.timer);
           var target = $(window).scrollTop();

           var interval = 30;
           var step = target/_this.default.duration*interval;
           clearInterval(_this.timer);
           _this.timer=setInterval(function(){
               var $curTop = $(window).scrollTop();
               if ($curTop<=0){
                   clearInterval(_this.timer);
                   $(window).on('scroll',function(){
                      _this.computedDisplay();
                   });
                   return;
               }
               $curTop-=step;
               $(window).scrollTop($curTop);

           },interval)
       })
    },
    showHide:function(){
        var _this=this;
        $(window).on('scroll',function(){
            _this.computedDisplay();
        })
    },
    computedDisplay:function(){
        if ($(window).height()<$(window).scrollTop()){
            this.$go.show();
        }else {
            this.$go.hide();
        }
    }
};