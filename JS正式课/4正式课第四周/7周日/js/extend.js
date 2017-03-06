/**
 * Created by wj007 on 2016/11/20.
 */

/*$.extend({//静态方法
    myTab:function(id){
        var $box = $(id);
        console.log($box);
        var $aBtn = $box.children('input');
        var $aDiv = $box.children('div');
        $aBtn.click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');
        })

    }
});*/

/*
$.extend({//静态方法，实例拿不到。只能类使用
    myTab:function(id) {
        $box = $(id);
        $aBtn = $box.children('input');
        $aDiv = $box.children('div');
       $aBtn.click(function(){
           $(this).addClass('on').siblings().removeClass('on');
           $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');
       })

    }

});
*/

/*$.fn.extend({//给原型上扩充方法
    myTab:function(){
        var $box = this;
        var $aBtn = $box.children('input');
        var $aDiv = $box.children('div');
        $aBtn.click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');
        })


    }



});*/

$.fn.extend({
    myTab:function(){
        var $box = this;
        var $aBtn = $box.children('input');
        var $aDiv = $box.children('div');
        $aBtn.click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $aDiv.eq($(this).index()).addClass('show').siblings().removeClass('show');

        })



    }


});