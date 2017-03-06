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
    function formatDate(temp) {
        var tempStr = temp || '{0}年{1}月{2}日 {3}月{4}时{5}分';
        var ary = this.match(/\d+/g);
        tempStr = tempStr.replace(/{(\d+)}/g, function () {
            var index = arguments[1],
                item = parseFloat(ary[index]) || 0;
            item = item.length < 10 ? '0' + item : item;
            return item;

        });
        return tempStr
    }

    pro.formatDate = formatDate;
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);
~function () {
    var $header = $('.header'),
        $main = $('.main'),
        $menu = $main.children('.menu'),
        $match = $main.find('.match');

    function computedMainH() {

        var winH = $(window).outerHeight(),
            headerH = $header.outerHeight(),
            tarH = winH - headerH - 40;
        $main.css('height', tarH);
        $menu.css('height', tarH - 2);
        $match.css('height',tarH-82)
    }
    computedMainH();
    $(window).on('resize', computedMainH);
}();
/*--MENU--*/
var menuRender = (function () {
    var menuExample = null,
        $menu = $('.menu'),
        $link = $menu.find('a'),
        HASH = null;

    var $menuPlan = $.Callbacks();
    /*局部滚动*/
    $menuPlan.add(function () {
        menuExample = new IScroll('.menu', {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true
        });
        console.dir(menuExample.options)
    });
    /*HASH值定位*/
    $menuPlan.add(function () {
        HASH = window.location.href.queryURLParameter()['HASH'];
        HASH = HASH || 'nba';
        var $tarLink = $link.filter('[href="#' + HASH + '"]');
        $tarLink = $tarLink.length === 0 ? $link.eq(0) : $tarLink;
        $tarLink.addClass('bg');
        menuExample.scrollToElement($tarLink[0], 1000);
        calendarRender.init($tarLink.attr('data-cid'));
    });
    /*点击*/
    $menuPlan.add(function () {
        $link.on('click', function () {
            var _this = this;
            $link.each(function (index, item) {
                _this === item ? $(item).addClass('bg') : $(item).removeClass('bg');
            });
            calendarRender.init($(this).attr('data-cid'));
        });
    });
    return {
        init: function () {
            /*发布*/
            var Whref = window.location.href;
            if (Whref.indexOf('#') === -1) {
                window.location.href = window.location.href + '#nba';
            }
            $menuPlan.fire();
        }
    }
})();
/*--calendar--*/
var calendarRender = (function () {
    var $calendar = $('.calendar'),
        $wrapper = $calendar.find('.wrapper'),
        $link = null;
    var minL = 0,maxL = 0;
    var $btn = $calendar.find('.btn');
    var $calendarPlan = $.Callbacks();
    //数据绑定
    $calendarPlan.add(function (today, data, cid) {
        var $calTemplate = $('#calTemplate'),
            template = $calTemplate.html();
        var res = ejs.render(template, {calendarData: data});
        $wrapper.html(res).css('width', data.length * 110);
        $link = $wrapper.find('a');
        minL = -(data.length-7)*110;
    });
    //定位到今天日期的位置
    $calendarPlan.add(function (today, data, cid) {
        var $tarLink = $link.filter('[data-time="' + today + '"]');
        var $week = $tarLink.find('.week');
        if ($tarLink){
            $week.html('今天');
        }
        if ($tarLink.length===0){
            today = today.replace(/-/g,'');
            $link.each(function (index, item) {
                var itemTime=$(item).attr('data-time').replace(/-/g,'');
                if (itemTime>today){
                    $tarLink=$(item);
                    return false;
                }
            })
        }
        if($tarLink.length===0){
            $tarLink = $link.eq($link.length-1);
        }
        $tarLink.addClass('bg');
        var tarIndex = $tarLink.parent().index(),
            curL = -tarIndex*110+330;
        curL = curL>maxL?maxL:(curL<minL?minL:curL);
        $wrapper.css('left',curL);

        var staIn =Math.abs(curL/110),
            endIn = staIn+6;
        var startTime = $link.eq(staIn).attr('data-time'),
            endTime = $link.eq(endIn).attr('data-time');
        matchRender.init(startTime,endTime,cid);
    });
    //实现左右切换
    $calendarPlan.add(function (today, data, cid) {
        $btn.on('click',function () {
            var curL = parseFloat($wrapper.css('left'));
            if (curL%110!==0){
                curL = Math.round(curL/110)*110
            }
            $(this).hasClass('btnLeft')?curL+=770:curL-=770;
            curL = curL>maxL?maxL:(curL<minL?minL:curL);
            $wrapper.stop().animate({left:curL},300,function () {

                var curLeft=parseFloat($wrapper.css('left')),
                    staIn =Math.abs(curL/110),
                    endIn = staIn+6;
                $link.each(function (index, item) {
                    index==staIn?$(item).addClass('bg'):$(item).removeClass('bg')
                });
                var startTime = $link.eq(staIn).attr('data-time'),
                    endTime = $link.eq(endIn).attr('data-time');
                matchRender.init(startTime,endTime,cid);
            })
        })
    });
    return {
        init: function (cid) {
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?callback=calendar&columnId=' + cid,
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result.code == 0) {
                        result = result['data'];
                        var today = result['today'],
                            data = result['data'];
                        $calendarPlan.fire(today, data, cid)
                    }
                }
            })
        }
    }
})();
/*MATCH  下面具体数据展示区域*/
var matchRender = (function () {
    var $matchWrapper = $('.matchWrapper');
    var $aLi = null;
    var $wrapper = $('.wrapper');
    var $calLis = null;
    var $matchPlan = $.Callbacks();
    var scrollMatch = null;
    /*数据绑定*/
    $matchPlan.add(function (data,cid) {
        var $matTemplate = $('#matTemplate'),//获取script标签
            template = $matTemplate.html();
        var res = ejs.render(template, {matchData: data});//利用引擎生成标签。
        $matchWrapper.html(res);
        $aLi=$matchWrapper.find('li');
        /*match区域的滚动*/
            if (!scrollMatch){
                scrollMatch = new IScroll('.match',{
                    mouseWheel: true,
                    scrollbars: true,
                    fadeScrollbars: true
                })
            }else {
                scrollMatch.refresh();
            }
            var $curEle = $wrapper.find('a').filter('[class=bg]');
            var curEleTime = $curEle.attr('data-time');
            $aLi =$matchWrapper.find('li');
            $aLi.each(function (index, item) {
                var aLiTime = $(item).attr('data-time');
                if (curEleTime==aLiTime){
                    scrollMatch.scrollToElement(item, 1000);
                    return false
                }
            })
    });
    //点击天数，滚动到当天的位置
    $matchPlan.add(function (data,startTime,endTime,cid) {
            $calLis = $wrapper.find('a');
            $aLi = $matchWrapper.find('li');
        $.each($calLis,function (index, item) {

                item.onclick = function () {
                     $wrapper.find('a').filter('[class=bg]').removeClass('bg');
                     $(this).addClass('bg');
                    var Atime = this.getAttribute('data-time');
                    $aLi.each(function (index, item) {
                        var Ltime = $(item).attr('data-time');
                        if (Atime==Ltime){
                            scrollMatch.scrollToElement(item, 1000);
                            return false
                        }
                    })
                }
        });
    });
    return {
        init:function (startTime, endTime, cid) {
            $.ajax({
                url:'http://matchweb.sports.qq.com/kbs/list?columnId='+cid+'&startTime='+startTime+'&endTime='+endTime,
                type:'get',
                dataType:'jsonp',
                success:function (result) {
                    if (result && result.code==0){
                        var data = result['data'];
                        /*$matchPlan.remove(isS);*/
                        $matchPlan.fire(data,startTime,endTime,cid);
                    }
                }
            })
        },
    }
})();

menuRender.init();