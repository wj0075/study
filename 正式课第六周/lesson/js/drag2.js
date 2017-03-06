/**
 * Created by 39753 on 2016/11/29.
 */
var oDiv=document.getElementById('div');
ev.on(oDiv,'mousedown',down);
function down(e){//记录位置
    e=e||window.event;
    this.l=this.offsetLeft;
    this.t=this.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    this.MOVE=ev.processThis(move,this);
    this.UP=ev.processThis(up,this);
    if(this.setCapture){
        this.setCapture();
        ev.on(this,'mousemove',move);
        ev.on(this,'mouseup',up)
    }else{
        ev.on(document,'mousemove',this.MOVE);
        ev.on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    //放一个帮我们监听的人，等鼠标按下事件发生的时候，通知提前跟他约定的方法去执行；
    //通知和发布的功能；
    ev.fire(this,'selfDown',e);
}
function move(e){
    e=e||window.event;
    this.style.left=e.clientX-this.x+this.l+'px';
    this.style.top=e.clientY-this.y+this.t+'px';
    ev.fire(this,'selfMove',e)//等mousemove事件发生的时候，通知所有跟自定义行为selfMove有关的方法调用；
}
function up(e){
    e=e||window.event;
    if(this.releaseCapture){
        this.releaseCapture();
        ev.off(this,'mousemove',move);
        ev.off(this,'mouseup',up)
    }else{
        ev.off(document,'mousemove',this.MOVE);
        ev.off(document,'mouseup',this.UP);
    }
    ev.fire(this,'selfUp',e)
}