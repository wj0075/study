/**
 * Created by wj007 on 2016/11/22.
 */
function Drag(bar,target){
    this.bar = bar;
    this.target = target;
    this.flag = false;
}
Drag.prototype = {
    constructor:Drag,
    init:function(){
        var _this = this;
        _this.left = utils.getCss(_this.target,'left');
        _this.top = utils.getCss(_this.target,'top');
        _this.mousPosX = null;
        _this.mousePosY = null;

        _this.bindEvent();
    },
    bindEvent:function(){
        var temp = this;
        temp.bar.onmousedown = function(e){
            e = e|| window.event;
            temp.flag = true;
            temp.mousPosX = e.clientX;
            temp.mousePosY = e.clientY;
            document.addEventListener('mousemove',function(e){
                e = e||window.event;
                if (temp.flag){
                    temp.target.style.left = temp.left+e.clientX-temp.mousPosX+'px';
                    temp.target.style.top = temp.top+e.clientY-temp.mousePosY+'px';
                }
            });
            document.addEventListener('mouseup',function(e){
                temp.flag = false;
                temp.left = utils.getCss(temp.target,'left');
                temp.top = utils.getCss(temp.target,'top');
            })
        }
    }
};