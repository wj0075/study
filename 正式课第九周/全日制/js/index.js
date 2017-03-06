/*--String.prototype--*/
~function (pro) {
    function queryURLParameter() {
        var reg = /([^?&=#]+)=([^?&=#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        reg = /#([^?=&#]+)/;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    }

    function formatDate(temp) {
        temp = temp || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var ary = this.match(/\d+/g);
        temp = temp.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                item = parseFloat(ary[index]) || 0;
            item < 10 ? item = '0' + item : null;
            return item;
        });
        return temp;
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatDate = formatDate;

    /*
     * 2015-12-26 6:25:2
     * ->2015年12月26日 06时25分02秒   12-26 06:25
     * '2015-12-26 6:25:2'.formatDate()
     * '2015-12-26 6:25:2'.formatDate('{1}-{2} {3}:{4}')
     */
}(String.prototype);

/*--MAIN--*/
~function () {
    var $header = $('.header'),
        $main = $('.main'),
        $menu = $main.children('.menu');

    //->computedMainHeight:计算MAIN区域的高度
    function computedMainHeight() {
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

    var $menuPlan = $.Callbacks();//->create plan
    //->add:to plan method
    //->remove: remove plan method
    //->fire: fire plan method run

    //->实现局部滚动
    $menuPlan.add(function () {
        menuExample = new IScroll('.menu', {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true
        });
    });

    //->通过HASH值来定位
    $menuPlan.add(function () {
        HASH = window.location.href.queryURLParameter()['HASH'];
        HASH = HASH || 'nba';
        var $tarLink = $link.filter('[href="#' + HASH + '"]');
        $tarLink = $tarLink.length === 0 ? $link.eq(0) : $tarLink;
        $tarLink.addClass('bg');
        menuExample.scrollToElement($tarLink[0], 0);

        //->默认选中完成后,我们还需要告诉日历区域展示的是那一场赛事的信息
        calendarRender.init($tarLink.attr('data-cid'));
    });

    //->绑定点击事件
    $menuPlan.add(function () {
        $link.on('click', function () {
            var _this = this;
            $link.each(function (index, item) {
                _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
            });

            //->点击完成后,我们也需要控制右侧日历区域的数据更换
            calendarRender.init($(this).attr('data-cid'));
        });
    });

    return {
        init: function () {
            $menuPlan.fire();
        }
    }
})();

/*--CALENDAR--*/
var calendarRender = (function () {
    var $calendar = $('.calendar'),
        $wrapper = $calendar.find('.wrapper'),
        $link = null,
        $btn = $calendar.find('.btn');
    var maxL = 0, minL = 0;

    var $calendarPlan = $.Callbacks();

    //->数据绑定
    $calendarPlan.add(function (today, data, cid) {
        var $calTemplate = $('#calTemplate'),
            template = $calTemplate.html();
        var res = ejs.render(template, {calendarData: data});
        $wrapper.html(res).css('width', data.length * 110);

        $link = $wrapper.find('a');
        minL = -(data.length - 7) * 110;
    });

    //->定位到今天日期的位置
    $calendarPlan.add(function (today, data, cid) {
        var $tarLink = $link.filter('[data-time="' + today + '"]');
        //->如果今天日期在列表中不存在的话,我们找当天日期后面最靠近的那一项(拿当天的日期到列表中一个个的比较,直到遇到一个比今天日期大的即可)
        if ($tarLink.length === 0) {
            today = today.replace(/-/g, '');
            $link.each(function (index, item) {
                var itemTime = $(item).attr('data-time').replace(/-/g, '');
                if (itemTime > today) {
                    $tarLink = $(item);
                    return false;
                }
            });
        }
        //->这么着就一定可以了吗?NO,如果没有比今天日期大的,我们选中最后一项即可
        if ($tarLink.length === 0) {
            $tarLink = $link.eq($link.length - 1);
        }

        $tarLink.addClass('bg');
        var tarIndex = $tarLink.parent().index(),
            curL = -tarIndex * 110 + 330;
        curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
        $wrapper.css('left', curL);

        //->获取到起始的日期和结束的日期,然后控制底下列表的数据改变
        var strIn = Math.abs(curL / 110),
            endIn = strIn + 6;
        var startTime = $link.eq(strIn).attr('data-time'),
            endTime = $link.eq(endIn).attr('data-time');
        matchRender.init(startTime, endTime, cid);
    });

    //->实现左右切换
    $calendarPlan.add(function (today, data, cid) {
        $btn.on('click', function () {
            var curL = parseFloat($wrapper.css('left'));
            //->防止出现一半,我们保证获取的curL是110的倍数
            if (curL % 110 !== 0) {
                curL = Math.round(curL / 110) * 110;
            }

            $(this).hasClass('btnLeft') ? curL += 770 : curL -= 770;
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);

            $wrapper.stop().animate({left: curL}, 300, function () {
                var curLeft = parseFloat($wrapper.css('left')),
                    strIn = Math.abs(curLeft / 110),
                    endIn = strIn + 6;
                $link.each(function (index, item) {
                    index == strIn ? $(item).addClass('bg') : $(item).removeClass('bg');
                });
                var startTime = $link.eq(strIn).attr('data-time'),
                    endTime = $link.eq(endIn).attr('data-time');

                matchRender.init(startTime, endTime, cid);
            });
        });
    });

    return {
        init: function (cid) {
            //->使用JSONP获取数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + cid,
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result.code == 0) {
                        result = result['data'];
                        var today = result['today'],
                            data = result['data'];
                        $calendarPlan.fire(today, data, cid);
                    }
                }
            });
        }
    }
})();

/*--MATCH--*/
var matchRender = (function () {
    return {
        init: function (startTime, endTime, cid) {

        }
    }
})();

menuRender.init();
