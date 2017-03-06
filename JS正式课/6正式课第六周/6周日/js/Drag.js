~function(){
    //事件发布类
    var EventEmitter=Class.extend({
        init:function(){},//私有方法
        on:function(type,fn){//对自定义事件的绑定
            if(!this[type]){
                this[type]=[];
            }
            var a = this[type];
            for (var i=0;i<a.length;i++){
                if (a[i]==fn) return;
            }
            a.push(fn);
        },
        fire:function(type,e){
          var a = this[type];
            if (a && a.length){
                for (var i=0;i<a.length;i++){
                    if (typeof a[i]==='function'){
                        a[i].call(this,e)
                    }else {
                        a.splice(i,1);
                        i--;
                    }
                }
            }
        },
        off:function(type,fn){
            var a = this[type];
            if (a && a.length){
                for (var i=0;i<a.length;i++){
                    if (a[i]===fn){
                        a[i]=null;
                    }else {
                        a.splice(i,1);
                        i--;
                    }
                }
            }
        }
    });
    //Drag 类
    window.Drag = EventEmitter.extend({
        init:function(ele){//相当于自己的构造函数
            this._super();//继承自父类的私有属性和方法
            this.ele=ele;
            this.l=this.t=this.x=this.y=null;
            this.DOWN = processThis(this.down,this);
            this.MOVE = processThis(this.move,this);
            this.UP = processThis(this.up,this);
            on(this.ele,'mousedown',this.DOWN)

        },
        //以下都是公有的属性和方法
        down:function(e){
            e=e||window.event;
            this.l= this.ele.offsetLeft;
            this.t = this.ele.offsetTop;
            this.x= e.clientX;
            this.y = e.clientY;
            if (this.ele.setCapture){
                this.ele.setCapture();
                on(this.ele,'mousemove',this.MOVE);
                on(this.ele,'mouseup',this.UP)
            }else {
                on(document,'mousemove',this.MOVE);
                on(document,'mouseup',this.UP);
                e.preventDefault();
            }
            this.fire("selfDown",e)
        },
        move:function(e){
            e = e||window.event;
            var curL = e.clientX-this.x+this.l;
            var curT = e.clientY-this.y +this.t;
            this.ele.style.left = curL+'px';
            this.ele.style.top = curT+'px';
            this.fire("selfMove",e)
        },
        up:function(e){
            e = e || window;
            if (this.ele.releaseCapture){
                this.ele.releaseCapture();
                off(this.ele,'mousemove',this.MOVE);
                off(this.ele,'mouseup',this.UP)
            }else {
                off(document,'mousemove',this.MOVE);
                off(document,'mouseup',this.UP);
            }
            this.fire("selfUp",e)
        },
        //判断边界值
        range:function(opt){
            this.opt = opt;
            this.on('selfMove',this.addRange)
        },
        addRange:function(e){
            var opt = this.opt;
            var l = e.clientX-this.x+this.l;
            var t = e.clientY-this.y+this.t;
            if (l<=opt.left){
                l=opt.left
            }else if (l>=opt.right){
                l=opt.right;
            }
            if (t<=opt.top){
                t=opt.top
            }else if(t>=opt.bottom){
                t=opt.bottom;
            }
            this.ele.style.left = l+'px';
            this.ele.style.top = t+'px';
        },

        //边框为虚线，点击的时候背景色为透明，移动的时候为虚线边框，抬手的时候移动到当前位置，颜色成为原来的颜色
        border:function(){
            this.on('selfDown',this.frame);
            this.on('selfMove',this.drap);
            this.on('selfUp',this.recover);
        },
        frame:function(){
            this.oldColor = utils.css(this.ele,'backgroundColor');
            this.oldHtml = this.ele.innerHTML;
            this.ele.style.border='2px dashed black';

        },
        drap:function(){
            this.ele.innerHTML = '';
            this.ele.style.backgroundColor = 'transparent'
        },
        recover:function(){
            this.ele.style.backgroundColor = this.oldColor;
            this.ele.innerHTML = this.oldHtml;
            this.ele.style.zIndex = 4;
        }


    })
}();
