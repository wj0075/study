var oDiv = document.getElementsByTagName('div')[0];
ev.on(oDiv,'mousedown',down);
function down(e){
    e = e||window.event;
    this.left = this.offsetLeft;
    this.top = this.offsetTop;
    this.x = e.clientX;
    this.y = e.clientY;
    this.MOVE = ev.processThis(move,oDiv);
    this.UP = ev.processThis(up,oDiv);
    if (this.setCapture){
        this.setCapture();
        ev.on(oDiv,'mousemove',move);
        ev.on(oDiv,'mouseup',up);
    }else {
        ev.on(document,'mousemove',this.MOVE);
        ev.on(document,'mouseup',this.UP);
    }
    e.preventDefault();
    ev.fire(this,"selfDown",e);
}
function move(e){
    e = e || window.event;
    var curL = e.clientX-this.x+this.left;
    var curT = e.clientY - this.y + this.top;
    var minL = 0,maxL = utils.win('clientWidth')-this.offsetWidth;
    var minT = 0,maxT = utils.win('clientHeight')-this.offsetHeight;
    curL = curL<minL?minL:(curL>maxL?maxL:curL);
    curT = curT<minT?minT:(curT>maxT?maxT:curT);
    this.style.left = curL+'px';
    this.style.top = curT+'px';
    ev.fire(this,"selfMove",e)
}
function up(e){
    if (this.releaseCapture){
        this.releaseCapture();
        ev.off(oDiv,'mousemove',move);
        ev.off(oDiv,'mouseup',up);
    }else {
        ev.off(document,'mousemove',this.MOVE);
        ev.off(document,'mouseup',this.UP);
    }
    ev.fire(this,"selfUp",e)
}