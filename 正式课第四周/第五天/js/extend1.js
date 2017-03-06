/**
 * Created by 39753 on 2016/11/20.
 */
$.extend({//静态方法
    myColor:function(ele,color){
        ele.css('background',color);
    },
    tab:function(id){
        var $box=$(id);
        //var $aBtn=$box.find('input');
        var $aBtn=$box.children('input');
        var $aDiv=$box.children('div');
        $aBtn.click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');
        })
    }
})