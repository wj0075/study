~function (pro) {
    function queryURLParameter() {
        //->GET PARAMETER
        var reg = /([^?&=#]+)=([^?&=#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        //->GET HASH
        reg = /#([^?=&#]+)/;
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

    //->computedMainHeight:计算MAIN区域的高度
    function computedMainHeight() {
        //outerHeight=>offsetHeight  innerHeight=>clientHeight
        var winH = $(window).outerHeight(),
            headerH = $header.outerHeight(),
            tarH = winH - headerH - 40;
        $main.css('height', tarH);
        $menu.css('height', tarH - 2);
    }

    computedMainHeight();
    $(window).on('resize', computedMainHeight);
}();

/*--MENU--*/
var menuRender = (function () {
    var menuExample = null,
        $menu = $('.menu'),
        $link = $menu.find('a'),
        HASH = null;
    /*
     JQ中的筛选方法:
     children:子代筛选
     find:后代筛选
     filter:同级筛选
     */
    return {
        init: function () {
            //->实现局部滚动
            menuExample = new IScroll('.menu', {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true,//->控制滚动条操作的时候在显示
                useTransform: false,
                useTransition: false,
                bounce: false //->去除到达边界的缓冲效果,默认是TRUE
            });

            //->获取HASH值,然后默认让其中的某一个A选中
            HASH = window.location.href.queryURLParameter()['HASH'];
            HASH = HASH || 'nba';
            var $tarLink = $link.filter('[href="#' + HASH + '"]');
            //->通过JQ获取结果,即使没有获取到,得到的也是一个空集合,只不过集合中的LENGTH为零而已，!$tarLink这种方式不能判断是否获取到
            //->JQ $link[0]/$link.get(0)/$link.eq(0) 前两个一样获取到的结果是原生JS对象,最后一个获取到的结果依然还是JQ对象
            $tarLink = $tarLink.length === 0 ? $link.eq(0) : $tarLink;
            $tarLink.addClass('bg');
            menuExample.scrollToElement($tarLink[0], 0);

            //->给所有的A标签绑定点击事件
            //$link.click(function(){});
            $link.on('click', function () {
                //=>$(this).addClass('bg').parent().siblings().children('a').removeClass('bg');
                var _this = this;
                $link.each(function (index, item) {
                    //this->item
                    _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
                });
            });
        }
    }
})();
menuRender.init();