/**
 * Created by 39753 on 2016/12/4.
 */
(function(){
    //事件发布类；
    var EventEmitter=Class.extend({
        init:function(){},
        on:function(type,fn){//对自定义事件的绑定
            if(!this[type]){
                this[type]=[];
            }
            var a=this[type];
            for(var i=0; i<a.length; i++){
                if(a[i]===fn) return;
            }
            a.push(fn);
        },
        fire:function(type,e){
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
        },
        off:function(type,fn){
            var a=this[type];
            if(a && a.length){
                for(var i=0; i<a.length; i++){
                    if(a[i]==fn){
                        a[i]=null;
                        break;
                    }
                }
            }
        },
    });
    //Drag类；
    window.Drag=EventEmitter.extend({
        init:function(ele){//构造函数
            this._super();
            this.ele=ele;
            this.x=this.y=this.l=this.t=null;
            this.DOWN=processThis(this.down,this);
            this.MOVE=processThis(this.move,this);
            this.UP=processThis(this.up,this);
            on(this.ele,'mousedown',this.DOWN)
        },
        //以下都是公有的属性和方法；
        aIndex:0,//添加共有属性
        down:function(e){
            this.l=this.ele.offsetLeft;
            this.t=this.ele.offsetTop;
            this.x=e.clientX;
            this.y=e.clientY;
            if(this.ele.setCapture){//IE
                this.ele.setCapture();
                on(this.ele,'mousemove',this.MOVE);
                on(this.ele,'mouseup',this.UP);
            }else{//标准：document
                on(document,'mousemove',this.MOVE);
                on(document,'mouseup',this.UP);
                e.preventDefault();
            }
            this.fire('selfDown',e)
        },
        move:function(e){
            e=e||window.event;
            this.ele.style.left=this.l+e.clientX-this.x+'px';
            this.ele.style.top=this.t+e.clientY-this.y+'px';
            this.fire('selfMove',e);
        },
        up:function(){
            if(this.ele.releaseCapture){//IE
                this.ele.releaseCapture();
                off(this.ele,'mousemove',this.MOVE);
                off(this.ele,'mouseup',this.UP);
            }else{//标准：document
                off(document,'mousemove',this.MOVE);
                off(document,'mouseup',this.UP);
            }
            this.fire('selfUp')
        },
        creaseIndex:function(){
            this.on('selfDown',function(){
                this.ele.style.zIndex=++Drag.prototype.aIndex;
            })
            return this;
        },
        range:function(opt){
            this.opt=opt;
            this.on('selfMove',this.addRange);
            return this;
        },
        addRange:function(e){
            var l=this.l+e.clientX-this.x;
            var t=this.t+e.clientY-this.y;
            var opt=this.opt;
            if(l<opt.left){
                l=opt.left
            }else if(l>opt.right){
                l=opt.right
            }
            if(t<opt.top){
                t=opt.top;
            }else if(t>opt.bottom){
                t=opt.bottom;
            }
            this.ele.style.left=l+'px';
            this.ele.style.top=t+'px';
            return this;
        },
        jump:function(){
            this.on('selfDown',this.clearEffect);
            this.on('selfMove',this.getSpeedX);
            this.on('selfUp',this.fly);
            this.on('selfUp',this.drop);
            return this;
        },
        clearEffect:function(){
            clearTimeout(this.flyTimer);
            clearTimeout(this.dropTimer);
            return this;
        },
        getSpeedX:function(e){
            if(!this.prev){
                this.prev=e.clientX;
            }else{
                this.speedX=e.clientX-this.prev;
                this.prev=e.clientX;
            }
            return this;
        },
        fly:function(){
            clearTimeout(this.flyTimer)
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
                this.flyTimer=setTimeout(processThis(this.fly,this),10);
            }
            return this;
        },
        drop:function(){
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
                this.tmp++;
            }else{
                this.tmp=0;
            }
            if(this.tmp<2){
                this.ele.style.top=t+'px';
                this.dropTimer=setTimeout(processThis(this.drop,this),10)
            }
            return this;
        },
        photo:function(aEle){
            this.aEle=aEle;

            for(var i=0; i<aLi.length; i++){
                var oLi=aLi[i];
                oLi.oldColor=utils.css(oLi,'backgroundColor');
            }
            this.on('selfDown',this.creaseIndex);
            this.on('selfMove',this.hited);
            this.on('selfUp',this.changePos);
        },
        isHited:function(l,r){
            if(l.offsetLeft+l.offsetWidth<r.offsetLeft||l.offsetTop+l.offsetHeight<r.offsetTop||l.offsetLeft>r.offsetLeft+r.offsetWidth||l.offsetTop>r.offsetTop+r.offsetHeight){
                return false;
            }else{
                return true;
            }
        },
        hited:function(){
            this.ary=[];
            var aLi=this.aEle;
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

        },
        changePos:function(){
            var ary=this.ary; //[li.dis,li,li]
            if(ary.length){
                for(var i=0; i<ary.length; i++){
                    var oLi=ary[i];
                    oLi.dis=Math.pow(this.ele.offsetLeft-oLi.offsetLeft,2)+Math.pow(this.ele.offsetTop-oLi.offsetTop,2);
                    oLi.style.background=oLi.oldColor;
                }
                ary.sort(function(a,b){
                    return a.dis-b.dis;
                })
                var shortest=ary[0];
                shortest.style.background='purple';
                this.ele.style.background='purple';
                animate({
                    id:this.ele,
                    target:{
                        left:shortest.l,
                        top:shortest.t
                    },
                    duration:500,
                    effect:3
                })
                animate({
                    id:shortest,
                    target:{
                        left:this.ele.l,
                        top:this.ele.t
                    },
                    duration:500,
                    effect:3
                })
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
        }
    })
})();








