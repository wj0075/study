/**
 * Created by 39753 on 2016/11/30.
 */
function EventEmitter(){};//订阅发布模式-》扩充产品的功能：1）客户端 2）开发端
EventEmitter.prototype.on=function(type,fn){//跟某个自定义行为有关的方法，都放进数组
    if(!this[type]){
        this[type]=[];
    }
    var a=this[type];
    for(var i=0; i<a.length; i++){
        if(a[i]==fn) return;
    }
    a.push(fn);
    return this;
};
EventEmitter.prototype.fire=function(type,e){//拿到数组，顺序调用
    var a=this[type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(typeof a[i]==='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off=function(type,fn){//拿到数组，匹配解除
    var a=this[type];
    if(a && a.length){
        for(var i=0; i<a.length; i++){
            if(a[i]===fn){
                a[i]=null;
                break;
            }
        }
    }
};
//要保证构造函数中，所有的this都指向实例；
function Drag(ele){
    this.ele=ele;

    this.l=this.t=this.x=this.y=null;
    console.log(this.ele.l);
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN)
}
//静态属性；
Drag.prototype=new EventEmitter;
Drag.prototype.constructor=Drag;
Drag.prototype.down=function(e){//保存位置
    e=e||window.event;
    this.l=this.ele.offsetLeft;
    this.t=this.ele.offsetTop;
    this.x=e.clientX;
    this.y=e.clientY;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{//标准浏览器-document
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();
    }
    this.fire('selfDown',e)
};
Drag.prototype.move=function(e){//计算位置；
    e=e||window.event;
    this.ele.style.left=this.l+e.clientX-this.x+'px';
    this.ele.style.top=this.t+e.clientY-this.y+'px';
    console.log(this.ele.l)
    this.fire('selfMove',e)
};
Drag.prototype.up=function(){//解除事件绑定
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{//标准浏览器-document
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    this.fire('selfUp');
};
Drag.prototype.range=function(opt){
    //想把opt中的数据，跟move事件联系；
    this.opt=opt;
    this.on('selfMove',this.addRange);
};
Drag.prototype.addRange=function(e){
    var l=this.l+e.clientX-this.x;
    var t=this.t+e.clientY-this.y;
    var opt=this.opt;
    if(l<=opt.left){
        l=opt.left;
    }else if(l>=opt.right){
        l=opt.right;
    }
    if(t<=opt.top){
        t=opt.top;
    }else if(t>=opt.bottom){
        t=opt.bottom;
    }
    this.ele.style.left=l+'px';
    this.ele.style.top=t+'px';
};
Drag.prototype.border=function(){
    this.on('selfDown',this.addBorder);
    this.on('selfMove',this.moveBorder);
    this.on('selfUp',this.removeBorder);
};
Drag.prototype.addBorder=function(){
    this.ele.style.border='2px dashed red';
    this.oldColor=utils.css(this.ele,'backgroundColor');
    this.oldHtml=this.ele.innerHTML;
};
Drag.prototype.moveBorder=function(){
    this.ele.innerHTML='';
    this.ele.style.background='none';
};
Drag.prototype.removeBorder=function(){
    this.ele.style.background=this.oldColor;
    this.ele.style.border='none';
    this.ele.innerHTML=this.oldHtml;
};
Drag.prototype.jump=function(){
    this.on('selfDown',creaseIndex).on('selfDown',clearEffect).on('selfMove',getSpeedX).on('selfUp',fly).on('selfUp',drop);
};
//photo入口；
Drag.prototype.photo=function(aEle){
    this.aLi=aEle;
    this.on('selfDown',this.creaseIndex);
    this.on('selfMove',this.hited);
    this.on('selfUp',this.changePos);
};
Drag.prototype.zIndex=0;
Drag.prototype.creaseIndex=function(){
    this.ele.style.zIndex=++Drag.prototype.zIndex;//原型；  Drag.xxx 类的静态方法 static
};
Drag.prototype.isHited=function(l,r){
    if(l.offsetLeft+l.offsetWidth<r.offsetLeft||l.offsetTop+l.offsetHeight<r.offsetTop||l.offsetLeft>r.offsetLeft+r.offsetWidth||l.offsetTop>r.offsetTop+r.offsetHeight){
        return false;
    }else{
        return true;
    }
};
Drag.prototype.hited=function(){
    //找到跟当前元素发生碰撞的一些元素；
    this.ary=[];
    var aLi=this.aLi;
    for(var i=0; i<aLi.length; i++){
        var oLi=aLi[i];
        if(this.ele===oLi) continue;
        if(this.isHited(this.ele,oLi)){
            this.ary.push(oLi);
            oLi.style.background='red';
        }else{
            oLi.style.background=oLi.oldColor;
        }
    }
};
Drag.prototype.changePos=function(){
    var ary=this.ary;//[li.dis, li.dis, li, li]
    if(ary && ary.length){
        for(var i=0; i<ary.length; i++){
            var oLi=ary[i];
            oLi.dis=Math.pow(this.ele.offsetLeft-oLi.offsetLeft,2)+Math.pow(this.ele.offsetTop-oLi.offsetTop,2);
            oLi.style.background=oLi.oldColor;
        }
        ary.sort(function(a,b){
            return a.dis-b.dis;
        });
        var shortest=ary[0];

        this.ele.style.background='purple';
        shortest.style.background='purple';
        animate({
            id:this.ele,
            target:{
                left:shortest.l,
                top:shortest.t
            },
            duration:500,
            effect:3
        });
        animate({
            id:shortest,
            target:{
                left:this.ele.l,
                top:this.ele.t
            },
            duration:500,
            effect:3
        });
        //当位置改变的时候，一定要更新元素身上存的位置；
        var l=this.ele.l,t=this.ele.t;
        this.ele.l=shortest.l,this.ele.t=shortest.t;
        shortest.l=l,shortest.t=t;
        this.ary=[];
    }else{
        animate({
            id:this.ele,
            target:{
                left:this.ele.l,
                top:this.ele.t
            },
            duration:500,
            effect:3
        })
    }
};










