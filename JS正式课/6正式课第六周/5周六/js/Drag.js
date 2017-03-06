//订阅发布者模式
function EventEmitter() {
};
EventEmitter.prototype.on = function (type, fn) {//跟某个自定义行为有关的方法，都放进数组
    if (!this[type]) {
        this[type] = [];
    }
    var a = this[type];
    for (var i = 0; i < a.length; i++) {
        if (a[i] == fn) return;
    }
    a.push(fn);
    return this;
};
EventEmitter.prototype.off = function (type, fn) {
    var a = this[type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == fn) {
                a[i] = null;
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.fire = function (type, e) {
    var a = this[type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] === 'function') {
                a[i].call(this, e)
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
};

function Drag(ele) {
    this.ele = ele;

    this.t = this.l = this.x = this.y = null;
    console.log(this.ele.l);
    this.DOWN = processThis(this.down, this);
    this.MOVE = processThis(this.move, this);
    this.UP = processThis(this.up, this);
    on(this.ele, 'mousedown', this.DOWN);
}
Drag.prototype=new EventEmitter;
Drag.prototype.constructor=Drag;
//纯净的拖拽
Drag.prototype.down = function (e) {
    e = e || window.event;
    this.l = this.ele.offsetLeft;
    this.t = this.ele.offsetTop;
    this.x = e.clientX;
    this.y = e.clientY;

    if (this.ele.setCapture) {
        this.ele.setCapture();
        on(this.ele, 'mousemove', this.MOVE);
        on(this.ele, 'mouseup', this.UP);
    } else {
        on(document, 'mousemove', this.MOVE);
        on(document, 'mouseup', this.UP);
        e.preventDefault();
    }
    this.fire('selfDown', e);//监听者

};
Drag.prototype.move = function (e) {
    e = e || window.event;
    var curL = e.clientX - this.x + this.l;
    var curT = e.clientY - this.y + this.t;
    this.ele.style.left = curL + 'px';
    this.ele.style.top = curT + 'px';
    this.fire('selfMove', e)
};
Drag.prototype.up = function (e) {
    e = e || window.event;
    if (this.ele.releaseCapture) {
        this.ele.releaseCapture();
        off(this.ele, 'mousemove', this.MOVE);
        off(this.ele, 'mouseup', this.UP);
    } else {
        off(document, 'mousemove', this.MOVE);
        off(document, 'mouseup', this.UP);
    }
    this.fire('selfUp', e)
};
//边界限制

/*
 Drag.prototype.range=function(opt){
 this.opt=opt;
 this.on('selfMove',this.addRange);
 };
 Drag.prototype.addRange=function(e){
 var l =this.opt.left,r=this.opt.right,t = this.opt.top,b=this.opt.bottom;
 var curL = e.clientX-this.x+this.l;
 var curT = e.clientY-this.y+this.t;

 if (curL<=l){
 curL=l
 }else if(curL>=r){
 curL=r
 }
 if (curT<=t){
 curT=t
 }else if (curT>=b){
 curT=b;
 }
 this.ele.style.left = curL+'px';
 this.ele.style.top=curT+'px';
 };*/

//弹力球
Drag.prototype.jump = function () {
    this.on('selfDown', this.creaseIndex).on('selfDown', this.clearEffect).on('selfMove', this.speed).on('selfUp', this.fly).on('selfUp', this.drop);
};
Drag.prototype.zIndex = 0;
Drag.prototype.creaseIndex = function () {
    this.ele.style.zIndex = ++Drag.prototype.zIndex;

};
Drag.prototype.clearEffect = function () {
    clearTimeout(this.flyTimer);
    clearTimeout(this.drapTimer);
    this.prev = null;
};
Drag.prototype.speed = function (e) {
    if (!this.prev) {
        this.prev = e.clientX
    } else {
        this.speedX = e.clientX - this.prev;
        this.prev = e.clientX;
    }
};
Drag.prototype.fly = function () {
    this.speedX *= 0.93;
    var l = this.ele.offsetLeft + this.speedX;
    var maxL = utils.win('clientWidth') - this.ele.offsetWidth;
    if (l <= 0) {
        l = 0;
        this.speedX *= -1
    } else if (l >= maxL) {
        l = maxL;
        this.speedX *= -1
    }
    if (Math.abs(this.speedX) >= 0.5) {
        this.ele.style.left = l + 'px';
        this.flyTimer = setTimeout(processThis(this.fly, this), 10)
    }
};
Drag.prototype.drop = function () {
    if (!this.speedY) {
        this.speedY = 9.8;
    } else {
        this.speedY += 9.8
    }
    this.speedY *= 0.95;
    var t = this.ele.offsetTop + this.speedY;
    var maxT = utils.win('clientHeight') - this.ele.offsetHeight;
    if (t >= maxT) {
        t = maxT;
        this.speedY *= -1;
        this.flag++;
    } else {
        this.flag = 0;
    }
    if (this.flag < 2) {
        this.ele.style.top = t + 'px';
        this.drapTimer = setTimeout(processThis(this.drop, this), 10)
    }


};

//照片墙
Drag.prototype.photo = function (opt) {
    this.aLi = opt;
    this.on('selfDown', this.creaseIndex);
    this.on('selfMove', this.hited);
    this.on('selfUp', this.changePos)
};
//判断任意两个元素时候相撞
Drag.prototype.isHite = function (l, r) {
    if (l.offsetLeft + l.offsetWidth < r.offsetLeft || l.offsetTop + l.offsetHeight < r.offsetTop || l.offsetLeft > r.offsetLeft + r.offsetWidth || l.offsetTop > r.offsetTop + r.offsetHeight) {
        return false;
    } else {
        return true;
    }
};
//在移动的过程中将碰撞到的元素收集到数组中
Drag.prototype.hited = function () {
    var aLi = this.aLi;
    this.ary = [];
    for (var i = 0; i < aLi.length; i++) {
        var oLi = aLi[i];
        if (this.ele === oLi) continue;
        if (this.isHite(this.ele, oLi)) {
            this.ary.push(oLi);
            oLi.style.background = 'red'
        } else {
            oLi.style.background = oLi.oldColor;
        }
    }
};
//在抬起的时候，判断最近的距离并交换位置。
Drag.prototype.changePos = function () {
    var ary = this.ary;
    if (ary && ary.length) {
        for (var i = 0; i < ary.length; i++) {
            var oLi = ary[i];
            oLi.dis = Math.pow(this.ele.offsetLeft - oLi.offsetLeft, 2) + Math.pow(this.ele.offsetTop - oLi.offsetTop, 2);
            oLi.style.background = oLi.oldColor;
        }
        ary.sort(function (a, b) {
            return a.dis - b.dis;
        });
        var shortest = ary[0];

        this.ele.style.background = 'purple';
        shortest.style.background = 'purple';
        animate({
            id: this.ele,
            target: {
                left: shortest.l,
                top: shortest.t
            }
        });
        animate({
            id: shortest,
            target: {
                left: this.ele.l,
                top: this.ele.t
            }
        });
        //交换位置后，保存现有的值
        var l = this.ele.l,t= this.ele.t;
        this.ele.l=shortest.l,this.ele.t=shortest.t;
        shortest.l=l,shortest.t=t;
    }else {
        animate({
            id: this.ele,
            target: {
                left: this.ele.l,
                top: this.ele.t
            }
        });
    }
};

