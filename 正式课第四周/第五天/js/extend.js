/**
 * Created by 39753 on 2016/11/20.
 */
$.fn.extend({// 给原型扩充方法
    myColor:function(color){
        //this=>
        this.css('background',color);
    },
    tab:function(){
        /*var $box=$('#box');*/
        var $box=this;
        //var $aBtn=$box.find('input');
        var $aBtn=$box.children('input');
        var $aDiv=$box.children('div');
        $aBtn.click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');
        })
    }
})