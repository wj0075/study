function EventEmitter(){};
EventEmitter.prototype.on=function(type,fn){
    if (!this[type]){
        this[type]=[];
    }
    var a = this[type];
    for (var i=0;i<a.length;i++){
        if (a[i]===fn) return;
    }
    a.push(fn);
};
EventEmitter.prototype.fire=function(type,e){
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
};
EventEmitter.prototype.off=function(type,fn){
    var a = this[type];
    if (a && a.length){
        for (var i=0;i<a.length;i++){
            if (a[i]===fn){
                a[i]=null;
                break;
            }

        }

    }
};

function Drag3(ele){
    this.ele = ele;
    this.l=this.t=this.x=this.y=null;
    //ev.on(this.ele,'mousedown',this.down);//this.down中的this现在指向了具体的对象，二在构造函数中需要方法中的this指向实例，所以要改变this的指向，在只会实例
    this.DOWN = ev.processThis(this.down,this);//调用事件库中的方法，使方法中的this改变。
    ev.on(this.ele,'mousedown',this.DOWN);
}
Drag3.prototype = new EventEmitter;
Drag3.prototype.constructor = Drag3;
Drag3.prototype.down=function(e){
    e = e || window.event;
    this.l = this.ele.offsetLeft;
    this.t = this.ele.offsetTop;
    this.x = e.clientX;
    this.y = e.clientY;
    this.MOVE = ev.processThis(this.move,this);
    this.UP = ev.processThis(this.up,this);
    if (this.ele.setCapture){
        this.ele.setCapture();
        ev.on(this.ele,'mousemove',this.MOVE);
        ev.on(this.ele,'mouseup',this.UP)
    }else {
        ev.on(document,'mousemove',this.MOVE);
        ev.on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    this.fire('selfDown',e);
};
Drag3.prototype.move = function(e){
    e = e || window.event;
    var l = e.clientX-this.x+this.l;
    var t = e.clientY-this.y+this.t;
    var minL = 0,maxL = utils.win('clientWidth')-this.ele.offsetWidth;
    var minT = 0,maxT = utils.win('clientHeight')-this.ele.offsetHeight;
    if (l<minL){
        l=minL
    }else if (l>=maxL){
        l=maxL;
    }
    if (t<minT){
        t=minT;
    }else if (t>=maxT){
        t=maxT;
    }
    this.ele.style.left = l+'px';
    this.ele.style.top = t+'px';
    this.fire('selfMove',e)
};
Drag3.prototype.up = function(e){
    if (this.ele.releaseCapture){
        this.ele.releaseCapture();
        ev.off(this.ele,'mousemove',this.MOVE);
        ev.off(this.ele,'mouseup',this.UP)
    }else {
        ev.off(document,'mousemove',this.MOVE);
        ev.off(document,'mouseup',this.UP)
    }
    this.fire('selfUp',e)
};
//限制边界的
Drag3.prototype.range = function(opt){
    this.opt = opt;
    this.on('selfMove',this.addRange);
};
Drag3.prototype.addRange = function(e){

    var opt = this.opt;
    var minL = opt.left,maxL = opt.right;
    var minT = opt.top,maxT = opt.bottom;
    var l = e.clientX-this.x+this.l;
    var t = e.clientY - this.y+this.t;
    if (l<minL){
        l=minL;
    }else if(l>=maxL){
        l=maxL
    }
    if (t<minT){
        t=minT;
    }else if(t>=maxT){
        t=maxT;
    }
    this.ele.style.left = l+'px';
    this.ele.style.top = t+'px';
};
//点击出现虚线边框，移动时只显示边框，抬起时边框消失，原有内容显示；
Drag3.prototype.border = function(e){
    this.on('selfDown',this.appear);
    this.on('selfMove',this.drap);
    this.on('selfUp',this.fade)
};
Drag3.prototype.appear = function(){
    this.ele.style.border = '2px dashed black';
    this.oldColor = utils.css(this.ele,'backgroundColor');
    this.oldHtml = this.ele.innerHTML;
};
Drag3.prototype.drap = function(){
    this.ele.style.backgroundColor='rgba(0,0,0,0)';
    this.ele.innerHTML = null;
};
Drag3.prototype.fade = function(){
    this.ele.style.border = '';
    this.ele.style.backgroundColor=this.oldColor;
    this.ele.innerHTML=this.oldHtml
};
//弹力球
Drag3.prototype.elastic = function(){
    this.on('selfDown',this.clearEffect);
    this.on('selfMove',this.speed);
    this.on('selfUp',this.fly);
    this.on('selfUp',this.drop)
};
Drag3.prototype.clearEffect=function(){
    clearTimeout(this.flyTimer);

};
Drag3.prototype.speed = function(e){
    if (!this.prev){
        this.prev = e.clientX;
    }else {
        this.speedX = e.clientX-this.prev;
        this.prev = e.clientX;
    }

};
Drag3.prototype.fly = function(){
    clearTimeout(this.flyTimer);
    var l = this.ele.offsetLeft + this.speedX;
    var minL = 0,maxL = utils.win('clientWidth')-this.ele.offsetWidth;
    if(l<minL){
        l=minL;
        this.speedX*=-1;
    }else if (l>=maxL){
        l=maxL;
        this.speedX*=-1;
    }
    this.speedX*=0.98;
    if (Math.abs(this.speedX)>0.5){
        this.ele.style.left = l+'px';
        this.flyTimer = setTimeout(ev.processThis(this.fly,this),10)
    }
};
Drag3.prototype.drop = function(){
    if (!this.speedY){
        this.speedY = 9.8
    }else {
        this.speedY+=9.8
    }
    this.speedY*=0.95;
    var t = this.ele.offsetTop+this.speedY;
    var maxT = utils.win('clientHeight')-this.ele.offsetHeight;
    if (t>maxT){
        t=maxT;
        this.speedY*=-1;
        this.tmp++;
    }else {
        this.tmp=0;
    }
    if (this.tmp<2){
        this.ele.style.top = t+'px';
        this.dropTimer = setTimeout(ev.processThis(this.drop,this),10)
    }
};

