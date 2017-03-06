/**
 * Created by wj007 on 2016/11/30.
 */
function EventEmitter(){};//订阅发布的类
EventEmitter.prototype.on=function(type,fn){
        if (!this[type]){
            this[type]=[];
        }
    var a = this[type];
    for (var i=0;i<a.length;i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
    //console.log(a);
};//订阅的
EventEmitter.prototype.off=function(type,fn){
    var a = this[type];
    if (a && a.length){
        for (var i=0;i<a.length;i++){
            if (a[i]==fn){
                a[i]=null;
                break;
            }
        }
    }
};
EventEmitter.prototype.fire = function(type,e){
    var a = this[type];
    if (a && a.length){
        for (var i=0;i<a.length;i++){
            if (typeof a[i]==='function'){
                a[i].call(this,e)
            }else {
                a.splice(i,1);
                a--;
            }
        }
    }
};//发布的

//要保证构造函数中的所有this指向实例
function Drag(ele){
    this.ele = ele;
    this.l=this.t=this.x=this.y=null;
    this.DOWN = ev.processThis(this.down,this);
    ev.on(this.ele,'mousedown',this.DOWN);

}
Drag.prototype = new EventEmitter;
Drag.prototype.constructor = Drag;
Drag.prototype.down=function(e){//保存位置
    e = e||window.event;
    this.l=this.ele.offsetLeft;
    this.t = this.ele.offsetTop;
    this.x = e.clientX;
    this.y = e.clientY;
    this.tmp=0;
    this.MOVE = ev.processThis(this.move,this);
    this.UP = ev.processThis(this.up,this);
    if (this.ele.setCapture){
        this.ele.setCapture();
        ev.on(this.ele,'mousemove',this.MOVE);
        ev.on(this.ele,'mouseup',this.UP);
    }else {
        ev.on(document,'mousemove',this.MOVE);
        ev.on(document,'mouseup',this.UP)
        e.preventDefault();
    }
    this.fire('selfdown',e)
    this.fire('selfDown',e)
};
Drag.prototype.move = function(e){
    e = e||window.event;
    var curL = e.clientX-this.x+this.l;
    var curT = e.clientY-this.y+this.t;
    var minL=0,maxL = utils.win('clientWidth')-this.ele.offsetWidth;
    var minT =0,maxT = utils.win('clientHeight')-this.ele.offsetHeight;
    //curL=curL<=minL?minL:(curL>maxT?maxL:curL);
    //curT = curT<=minT?minT:(curT>maxT?maxT:curT);
    if (curL<minL){
        curL=minL
    }else if (curL>maxL){
        curL = maxL;
    }else {
        curL=curL;
    }
    if (curT<minT){
        curT = minT
    }else if (curT>maxT){
        curT = maxT
    }else {
        curT=curT;
    }
    this.ele.style.left=curL+'px';
    this.ele.style.top=curT+'px';
    this.fire('selfmove',e);
    this.fire('selfMove',e);

};
Drag.prototype.up = function(e){
    e =e||window.event;
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        ev.off(this.ele,'mousemove',this.MOVE);
        ev.off(this.ele,'mouseup',this.UP);
    }else {
        ev.off(document,'mousemove',this.MOVE);
        ev.off(document,'mouseup',this.UP)
    }
    this.fire('selfup',e);
    this.fire('selfUp',e)
};
Drag.prototype.range = function(opt){
    this.opt = opt;
    this.on('selfMove',this.addRange)
};
Drag.prototype.addRange = function(e){
    var opt = this.opt;
    var minL =opt.left,maxL = opt.right;
    var minT = opt.top,maxT = opt.bottom;
    var l = e.clientX-this.x+this.l;
    var t = e.clientY-this.y+this.t;
    l = l<minL?minL:(l>=maxL?maxL:l);
    t = t<minT?minT:(t>=maxT?maxT:t);
    this.ele.style.left=l+'px';
    this.ele.style.top=t+'px';
};
Drag.prototype.border = function(){
    this.on('selfDown',this.appear);
    //this.on('selfDown',this.appear1);
    this.on('selfMove',this.drap);
    //this.on('selfMove',this.drap1)
    this.on('selfUp',this.fade);
};
/*Drag.prototype.appear1 = function(e){
    this.oBox = document.createElement('div');
    this.oBox.style.width = this.ele.offsetWidth+'px';
    this.oBox.style.height = this.ele.offsetHeight+'px';
    this.oBox.style.border = '2px dashed green';
    this.oBox.style.position = 'absolute';
    this.oBox.style.borderRadius = '50%';
    this.oBox.style.left = this.ele.offsetLeft-2+'px';
    this.oBox.style.top = this.ele.offsetTop-2+'px';
    this.ele.parentNode.appendChild(this.oBox);
};*/
Drag.prototype.appear=function(e){
    this.ele.style.border = '2px dashed red';
    this.oldColor = utils.css(this.ele,'backgroundColor')
    this.oldHtml = this.ele.innerHTML;
};
/*Drag.prototype.drap1 = function(e){

};*/
Drag.prototype.drap =function(){
    this.ele.innerHTML = '';
    this.ele.style.backgroundColor = 'rgba(0,0,0,0)';
};
Drag.prototype.fade = function(){
    this.ele.style.backgroundColor = this.oldColor;
    this.ele.style.border = '';
    this.ele.innerHTML = this.oldHtml;
    this.ele.style.zIndex = 3;
};