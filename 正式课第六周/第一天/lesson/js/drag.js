/**
 * Created by 39753 on 2016/11/29.
 */
var oDiv=document.getElementById('div');
var tmp=0;
//核心理念：所有的this都指向当前元素；
on(oDiv,'mousedown',down);
function down(e){//保存初始值
    e=e||window.event;
    this.l=this.offsetLeft;
    this.t=this.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    this.MOVE=processThis(move,this);
    this.UP=processThis(up,this);
    if(this.setCapture){
        this.setCapture();//oDiv;
        on(this,'mousemove',move);
        on(this,'mouseup',up);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    clearTimeout(this.flyTimer);
    clearTimeout(this.dropTimer);
}
function move(e){//计算位置：问题：焦点丢失的问题
    e=e||window.event;
    this.style.left=this.l+e.clientX-this.x+'px';
    this.style.top=this.t+e.clientY-this.y+'px';
    if(!this.prev){
        this.prev=e.clientX;//刚开始没有的时候，第一次的落脚点就是this.prev;
    }else{
        this.speedX=e.clientX-this.prev;
        this.prev=e.clientX;
    }
}
function up(){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,'mousemove',move);
        off(this,'mouseup',up);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    fly.call(this);
    drop.call(this);
}
function fly(){
    clearTimeout(this.flyTimer);
    this.speedX*=0.93;
    var l=this.offsetLeft+this.speedX;//200+0.3 200+0.2 200+0.4
    var maxL=utils.win('clientWidth')-this.offsetWidth;
    //边界值判断
    if(l>=maxL){
        l=maxL;
        this.speedX*=-1;//到达边界值的时候，速度变成相反的；
    }else if(l<=0){
        l=0;
        this.speedX*=-1;
    }
    if(Math.abs(this.speedX)>=0.5){
        this.style.left=l+'px';
        this.flyTimer=setTimeout(processThis(fly,this),10);
    }
}
function drop(){
    clearTimeout(this.dropTimer);
    //求速度；
    if(!this.speedY){
        this.speedY=9.8;
    }else{
        this.speedY+=9.8;
    }
    this.speedY*=0.93;
    var t=this.offsetTop+this.speedY;
    var maxT=utils.win('clientHeight')-this.offsetHeight;
    if(t>=maxT){//触底了
        t=maxT;
        this.speedY*=-1;
        tmp++;//1;
    }else{
        tmp=0;
    }
    if(tmp<2){
        this.style.top=t+'px';
        this.dropTimer=setTimeout(processThis(drop,this),10);
    }
}