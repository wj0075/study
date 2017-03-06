/**
 * Created by 39753 on 2016/12/1.
 */
class EventEmitter{
    constructor(){}
    on(type,fn){
        if(!this[type]){
            this[type]=[];
        }
        var a=this[type];
        for(var i=0; i<a.length; i++){
            if(a[i]==fn) return;
        }
        a.push(fn);
        return this;
    }
    fire(type,e){
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
    }
    off(type,fn){
        var a=this[type];
        if(a && a.length){
            for(var i=0; i<a.length; i++){
                if(a[i]===fn){
                    a[i]=null;
                    break;
                }
            }
        }
    }

}
class Drag extends EventEmitter{
    constructor(ele){
        super();//必须写；
        this.ele=ele;
        this.l=this.t=this.x=this.y=null;
        this.DOWN=processThis(this.down,this);
        this.MOVE=processThis(this.move,this);
        on(this.ele,'mousedown',this.DOWN);
    }
    down(e){
        e=e||window.event;
        this.fire('selfDown',e);
        on(this.ele,'mousemove',this.MOVE)
    }
    move(e){
        e=e||window.event;

        this.fire('selfMove',e)
    }
}