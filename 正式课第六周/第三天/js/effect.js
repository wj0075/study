/**
 * Created by 39753 on 2016/12/1.
 */
function creaseIndex(){
    this.ele.style.zIndex=++zIndex;
}
function clearEffect(){
    clearTimeout(this.flyTimer);
    clearTimeout(this.dropTimer);
    this.prev=null;
}
function getSpeedX(e){//在move情况下，得到横向的速度；
    if(!this.prev){
        this.prev=e.clientX;
    }else{
        this.speedX=e.clientX-this.prev;
        this.prev=e.clientX;
    }
}
function fly(){
    clearTimeout(this.flyTimer);
    this.speedX*=.93;
    var l=this.ele.offsetLeft+this.speedX;
    var maxL=utils.win('clientWidth')-this.ele.offsetWidth;
    if(l<=0){
        l=0;
        this.speedX*=-1;
    }else if(l>=maxL){
        l=maxL;
        this.speedX*=-1;
    }
    if(Math.abs(this.speedX)>=0.5){
        this.ele.style.left=l+'px';
        this.flyTimer=setTimeout(processThis(fly,this),10);
    }
}
function drop(){
    clearTimeout(this.dropTimer);
    if(!this.speedY){
        this.speedY=9.8;
    }else{
        this.speedY+=9.8;
    }
    this.speedY*=.93;
    var t=this.ele.offsetTop+this.speedY;
    var maxT=utils.win('clientHeight')-this.ele.offsetHeight;
    if(t>=maxT){
        t=maxT;
        this.speedY*=-1;
        this.flg++;
    }else{
        this.flg=0;
    }
    if(this.flg<2){
        this.ele.style.top=t+'px';
        this.dropTimer=setTimeout(processThis(drop,this),10);
    }
}











