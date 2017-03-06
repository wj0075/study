function GoTo(opt){
    if (!opt.id) return;
    this.default = {
        duration:1000
    };
    for (var key in opt){
        this.default[key]=opt[key];
    }
    this.goTOP = document.getElementById(this.default.id);
    this.timer = null;
    this.bOk =false;
    this.init();
}
GoTo.prototype={
    constructor:GoTo,
    init:function(){
        //1.点击a标签回到顶部
        var _this = this;
        window.onscroll=function(){
            _this.scroll();
        };
        this.goTOP.onclick=function(){
            _this.goto();
        };
    },

    scroll:function(){
        if (this.bOk) clearInterval(this.timer);
        this.bOk = true;
      if (utils.win('clientHeight')<=utils.win('scrollTop')){
          this.goTOP.style.display = 'block'
      } else {
          this.goTOP.style.display = 'none'
      }
    },
    goto:function(){
        var _this = this;
        var target = utils.win('scrollTop');
        var duration = _this.default.duration;
        var interval = 30;
        var step = target/duration*interval;
        //clearInterval(this.timer);
        _this.timer = setInterval(function(){
            var curPos = utils.win('scrollTop');
            if (curPos<=0){
                clearInterval(_this.timer);
                return;
            }
            curPos-=step;
            utils.win('scrollTop',curPos);
            _this.bOk = false;
        },interval)





    }


};
