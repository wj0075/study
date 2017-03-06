//事件的基类
function EventTarget(){
    this._events= {};
}
//给特定的事件添加监听回调函数
EventTarget.prototype.addEventListener = function(type,listener){
    this._events[type] = listener;
}
//触发事件 发射事件
EventTarget.prototype.emit = function(type){
    var args = Array.prototype.slice.call(arguments,1);
    this._events[type].apply(null,args);
    this['on'+type]&&this['on'+type].apply(null,args);
}

function Div(){}
Div.prototype = new EventTarget();
var oDiv = new Div();

oDiv.onclick = function(event){
    console.log('click1',event);
}

oDiv.addEventListener('click',function(event){
    console.log('click2',event);
})
oDiv.emit('click',{clientX:10,clientY:10,target:oDiv});