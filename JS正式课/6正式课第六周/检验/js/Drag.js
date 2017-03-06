function EventEmit() {
};
EventEmit.prototype.on = function (type, fn) {
    if (!this[type]) {
        this[type] = [];
    }
    var a = this[type];
    for (var i = 0; i < a.length; i++) {
        if (a[i] == fn) return
    }
    a.push(fn);
    return this;

};
EventEmit.prototype.fire = function (type, e) {
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
EventEmit.prototype.off = function (type, fn) {
    var a = this[type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === fn) {
                a[i] = null;
            } else {
                a.splice(i, 1);
                i--
            }
        }
    }
};
function Drag(ele) {
    this.ele = ele;
    this.l = this.t = this.x = this.y = null;
    this.DOWN = processThis(this.down, this);
    this.MOVE = processThis(this.move, this);
    this.UP = processThis(this.up, this);
    on(this.ele, 'mousedown', this.DOWN)
}
Drag.prototype = new EventEmit;
Drag.prototype.constructor = Drag;
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
    this.fire('selfDown', e)
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

//判断边界
Drag.prototype.range = function (opt) {
    this.opt = opt;
    this.on('selfMove', this.addRange)
};
Drag.prototype.addRange = function (e) {
    var opt = this.opt;
    var l = e.clientX - this.x + this.l;
    var t = e.clientY - this.y + this.t;
    if (l <= opt.left) {
        l = opt.left;
    } else if (l >= opt.right) {
        l = opt.right;
    }
    if (t <= opt.top) {
        t = opt.top
    } else if (t >= opt.bottom) {
        t = opt.bottom;
    }
    this.ele.style.left = l + 'px';
    this.ele.style.top = t + 'px';
};
//弹力球
Drag.prototype.zIndex = 0;
Drag.prototype.jump = function () {
    this.on('selfDown', this.creaseIndex);
    this.on('selfDown', this.clearEffect);
    this.on('selfMove', this.speed);
    this.on('selfUp', this.fly);
    this.on('selfUp', this.drop);
};
Drag.prototype.creaseIndex = function () {
    this.ele.style.zIndex = ++Drag.prototype.zIndex;
};
Drag.prototype.clearEffect = function () {
    clearInterval(this.flyTimer);
    clearTimeout(this.dropTimer);
    this.prev = null;

};
Drag.prototype.speed = function (e) {
    if (!this.prev) {
        this.prev = e.clientX;
    } else {
        this.speedX = e.clientX - this.prev;
        this.prev = e.clientX;
    }
};
Drag.prototype.fly = function () {
    clearInterval(this.flyTimer);
    this.speedX *= 0.97;
    var l = this.ele.offsetLeft + this.speedX;
    var minL = 0, maxL = utils.win('clientWidth') - this.ele.offsetWidth;
    if (l <= minL) {
        l = minL;
        this.speedX *= -1;
    } else if (l >= maxL) {
        l = maxL;
        this.speedX *= -1;
    }
    if (Math.abs(this.speedX) >= 0.5) {
        this.ele.style.left = l + 'px';
        this.flyTimer = setTimeout(processThis(this.fly, this), 10)
    }
};
Drag.prototype.drop = function () {
    clearTimeout(this.dropTimer);
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
        this.dropTimer = setTimeout(processThis(this.drop, this), 10);
    }
};

//照片墙
Drag.prototype.photo = function (opt) {
    this.aLi = opt;

    this.on('selfDown', this.creaseIndex);
    this.on('selfMove', this.hited);
    this.on('selfUp', this.changePos);
};
//判断元素是否相撞
Drag.prototype.isHited = function (l, r) {
    if (l.offsetLeft + l.offsetWidth < r.offsetLeft || l.offsetTop + l.offsetHeight < r.offsetTop || l.offsetLeft > r.offsetLeft + r.offsetWidth || l.offsetTop > r.offsetTop + r.offsetHeight) {
        return false;
    } else {
        return true;
    }
};
Drag.prototype.hited = function () {
    this.ary = [];
    var aLi = this.aLi;
    for (var i = 0; i < aLi.length; i++) {
        var oLi = aLi[i];
        if (this.ele == oLi) continue;
        if (this.isHited(this.ele, oLi)) {
            this.ary.push(oLi);
            oLi.style.background = 'red';
        } else {
            oLi.style.background = oLi.oldColor;
        }
    }
};
Drag.prototype.changePos = function () {
    var ary = this.ary;
    var _this = this;
    if (ary && ary.length) {
        for (var i = 0; i < ary.length; i++) {
            var oLi = ary[i];
            oLi.dis = Math.pow(this.ele.offsetLeft - oLi.offsetLeft, 2) + Math.pow(this.ele.offsetTop - oLi.offsetTop, 2);
            oLi.style.background = oLi.oldColor;
        }
        ary.sort(function (a, b) {
            return a.dis - b.dis
        });
        var shortest = ary[0];
        this.ele.style.background = 'yellow';
        shortest.style.background = 'yellow';
        animate({
            id: this.ele,
            target: {
                left: shortest.l,
                top: shortest.t
            },
            callback: function () {
                _this.ele.style.background = _this.ele.oldColor;
                shortest.style.background = oLi.oldColor;
            }
        });
        animate({
            id: shortest,
            target: {
                left: this.ele.l,
                top: this.ele.t
            },
            callback: function () {
                _this.ele.style.background = _this.ele.oldColor;
                shortest.style.background = oLi.oldColor;
            }
        });
        var l = this.ele.l, t = this.ele.t;
        this.ele.l = shortest.l, this.ele.t = shortest.t;
        shortest.l = l, shortest.t = t;
    } else {
        animate({
            id: this.ele,
            target: {
                left: this.ele.l,
                top: this.ele.t
            }
        });
    }
};

