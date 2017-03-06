~function (pro) {
    function queryURLParameter() {
        //->GET parameter
        var reg = /([^?&#=]+)=([^?&#=]+)/g;
        var obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        //->get hash
        reg = /#([^?&#=]+)/;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });

        return obj;
    }

    pro.queryURLParameter = queryURLParameter;
}(String.prototype);


~function () {
    var $header = $('.header'),
        $main = $('.main'),
        $menu = $main.children('.menu');
    //computedMainH：计算main区域内的高度
    function computedMainH() {
        /*var winH = document.documentElement.clientHeight||document.body.clientHeight;*/
        //outerHeight=>offsetHeight  innerHeight=>clientHeight
        var winH = $(window).outerHeight(),
            headerH = $header.outerHeight(),
            tarH = winH - headerH - 40;
        $main.css('height', tarH);
        $menu.css('height', tarH - 2);
    }

    computedMainH();
    $(window).on('resize', computedMainH);//当屏幕发生改变的时候，自动跟着改变


}();
/*--MENU--*/
var menuRender = (function () {
    var menuExample = null,
        $menu = $('.menu'),
        $link = $menu.find('a'), /*children（子代筛选）\find（后代筛选）\filter(同级查找)*/
        HASH = null;
    return {
        init: function () {
            menuExample = new IScroll('.menu', {
                mouseWheel: true,
                scrollbars: true,
                useTransform: false,//把CSS3属性关掉，用top值来控制
                useTransition: false,
                bounce: false,//去除到达边界的缓冲效果
            });
            //->获取HASH值，然后默认让其中的某一个A选中。
            HASH = location.href.queryURLParameter()['HASH'];
            HASH = HASH || 'nba';
            var $tarLink = $link.filter('[href="#' + HASH + '"]');
            //通过JQ获取到的结果，即使没有获取到，得到的也是一个空集合只不过集合中的length为0而已，!$tarLink这种方式不能判断是否获取到。
            //JQ $link[0]/$link,get(0)/$link.eq(0)
            //前两个一样获取到结果是原生JS对象，最后一个获取到的结果依然还是JQ对象。
            $tarLink = $tarLink.length === 0 ? $link.eq(0) : $tarLink;
            $tarLink.addClass('bg');
            menuExample.scrollToElement($tarLink[0], 0);
            //-》给所有的A标签绑定点击事件
            $link.on('click', function () {
                /*$(this).addClass('bg').parent().siblings().children('a').removeClass('bg');*/
                var _this = this;
                $link.each(function (index, item) {
                    _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
                })


            })
        }
    }
})();
menuRender.init();/**
 * Created by wj007 on 2016/12/22.
 */
