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

    //computedMainH：计算main区域内的高度
    function computedMainH() {
        /*var winH = document.documentElement.clientHeight||document.body.clientHeight;*/
        //outerHeight=>offsetHeight  innerHeight=>clientHeight
        var winH = $(window).outerHeight(),
            headerH = $header.outerHeight(),
            tarH = winH - headerH - 40;
        $main.css('height', tarH);
        $menu.css('height', tarH - 2);
        $match.css('height',tarH-82)
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

    var $menuPlan = $.Callbacks();
    /*局部滚动*/
    $menuPlan.add(function () {
        menuExample = new IScroll('.menu', {
            mouseWheel: true,
            scrollbars: true,
            fadeScrollbars: true
            /*useTransform: false,//把CSS3属性关掉，用top值来控制
             useTransition: false,
             bounce: false,//去除到达边界的缓冲效果*/
        });
    });

    /*HASH值定位*/
    $menuPlan.add(function () {
        HASH = window.location.href.queryURLParameter()['HASH'];
        HASH = HASH || 'nba';
        var $tarLink = $link.filter('[href="#' + HASH + '"]');
        //通过JQ获取到的结果，即使没有获取到，得到的也是一个空集合只不过集合中的length为0而已，!$tarLink这种方式不能判断是否获取到。
        //JQ $link[0]/$link,get(0)/$link.eq(0)
        //前两个一样获取到结果是原生JS对象，最后一个获取到的结果依然还是JQ对象。
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
        //默认选中完成后，我们还需要告诉了日历区展示的是那一场赛事的信息
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
        var $calTemplate = $('#calTemplate'),//获取script标签
            template = $calTemplate.html();//并获取script中的内容。
        var res = ejs.render(template, {calendarData: data});//利用引擎生成标签。
        $wrapper.html(res).css('width', data.length * 110);//将标签插入到容器中去，并把宽度动态设置上。

        $link = $wrapper.find('a');//数据绑定完成后，获取所有的a标签。
        //在这获取以下移动的最小值
        minL = -(data.length-7)*110;
    });
    //定位到今天日期的位置
    $calendarPlan.add(function (today, data, cid) {
        //首先我们要找到今天的日期所绑定的标签，这就需要获取到其中所有的a标签。因为在以后也要用到，所以定义一个在本模块中全局的变量。在数据绑定后，获取到它。
        //在所有的a标签中找到，自定义属性中data-time中时间是今天的那一个。
        var $tarLink = $link.filter('[data-time="' + today + '"]');//today传进来就是今天的日期。
        //先要进行判断，今天有没有比赛（或者说今天的日期有没有在列表中），，如果没有找到今天的日期，我们就需要找到当天日期靠后的那一项（拿当天的日期到列表中去一个个比较，知道遇到一个比当天日期大的就可以）。获取到的时间都是2016-12-22这样的格式，由于在数据绑定的时候已经对获得的时间数据进行了处理，所以我们在绑定的时候，添加一个自定义属性保存住未处理过的时间数据。2016-12-22这样的时间格式没有办法进行比较，所以我们把中间的-都去掉，用正则的方法。
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
        //还有一种情况就是找到最后就是自己最大，这种情况要处理以下，没有最大了就选最后一个就可以了
        if($tarLink.length===0){
            $tarLink = $link.eq($link.length-1);
        }
        //现在已经找到了应该给默认样式的元素，今天或后一天或最后一天这三种情况。
        $tarLink.addClass('bg');
        //要获取代表今天这个元素的索引，原网站中，代表今天的元素是被选中元素，并且是在中间一个。首先我们先不要让它显示在中间，先让他显示在最左边，获取到索引后，就知道它前面有多少个元素，从而知道要向左移动多少距离
        var tarIndex = $tarLink.parent().index(),//因为是根据li的宽度来进行计算位移，所以要找到li的索引
            curL = -tarIndex*110+330;
        curL = curL>maxL?maxL:(curL<minL?minL:curL);
        $wrapper.css('left',curL);
        //然后为了要为下面的展示区域展示内容，在这里需要获取到当前显示的起始时间和结束时间，然后控制下面列表的数据变化
        //获取开始的索引，因为知道移动的距离，而没110就是一个li，所以让移动的距离/110就可以得出当前的索引。
        var staIn =Math.abs(curL/110),
            endIn = staIn+6;
        var startTime = $link.eq(staIn).attr('data-time'),
            endTime = $link.eq(endIn).attr('data-time');
        matchRender.init(startTime,endTime,cid);
    });
    //实现左右切换
    $calendarPlan.add(function (today, data, cid) {
        //点击左右按钮实现左右轮播，每一次切换的都是真个区域，7个li，也就是宽度为770；
        $btn.on('click',function () {
            //点击的时候，先获取到具体的wrapper的left值
            var curL = parseFloat($wrapper.css('left'));
            //为了防止点击速度过宽，出现一半，不能以110的正倍数出现，我们给获取的值/110不是正数给取整
            if (curL%110!==0){
                curL = Math.round(curL/110)*110
            }
            $(this).hasClass('btnLeft')?curL+=770:curL-=770;
            curL = curL>maxL?maxL:(maxL<minL?minL:curL);
            $wrapper.stop().animate({left:curL},300,function () {
                //当动画结束后要做的事情，获取到这一列的起始时间和结束时间
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
    var matchExample = null,
        $match = $('.match'),
        $matchWrapper = $('.matchWrapper');
    var $matchPlan = $.Callbacks();
    /*数据绑定*/
    $matchPlan.add(function (data,cid) {
        var $matTemplate = $('#matTemplate'),//获取script标签
            template = $matTemplate.html();
        var lengthDD=0;
        var res = ejs.render(template, {matchData: data});//利用引擎生成标签。
        $matchWrapper.html(res);
        var $aLi=$matchWrapper.find('li');
        $aLi.each(function (index, item) {
            lengthDD+=parseFloat($(item).css('height'))
        });

        $matchWrapper.css('height',lengthDD);


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
                        $matchPlan.fire(data,cid);

                    }
                }
            })
        },
        /*match区域的滚动*/
        isCroll:function () {
            matchExample = new IScroll('.match', {
                mouseWheel: true,
                scrollbars: true,
                fadeScrollbars: true
            });
        }
    }
})();

matchRender.isCroll();
menuRender.init();