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
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN)
}
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
/*Drag.prototype.range=function(opt){
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
};*/
/*Drag.prototype.addBorder=function(){
    this.oDiv=document.createElement('p');
    this.oDiv.style.width=this.ele.offsetWidth+'px';
    this.oDiv.style.height=this.ele.offsetHeight+'px';
    this.oDiv.style.left=this.ele.offsetLeft-1+'px';
    this.oDiv.style.top=this.ele.offsetTop-1+'px';
    this.oDiv.style.border='1px dashed green';
    this.oDiv.style.position='absolute';
    this.ele.parentNode.appendChild(this.oDiv);
};*/
/*Drag.prototype.moveBorder=function(e){
    this.ele.style.display='none';
    this.oDiv.style.left=this.l+e.clientX-this.x+'px';
    this.oDiv.style.top=this.t+e.clientY-this.y+'px';
};*/
/*Drag.prototype.removeBorder=function(){
    this.oDiv.style.display='none';
    this.ele.style.display='block';
};*/
/*Drag.prototype.addBorder=function(){
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
};*/









