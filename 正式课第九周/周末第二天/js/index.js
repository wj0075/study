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
}(String.prototype);

/*--NAV--*/
var navRender = (function () {
    var $header = $('.header'),
        $menu = $header.children('.menu'),
        $nav = $('.nav');
    var isBlock = false;

    return {
        init: function () {
            $menu.tap(function () {
                if (!isBlock) {
                    isBlock = true;
                    $nav.css({
                        padding: '.1rem 0',
                        height: '2.22rem'
                    });
                    return;
                }
                isBlock = false;
                $nav.css({
                    padding: '0',
                    height: '0'
                });
            });
        }
    }
})();
navRender.init();

/*--MATCH--*/
var matchRender = (function () {
    var $matchPlan = $.Callbacks(),
        $match = $('.match'),
        $progress = null,
        $supportLeft = null,
        $supportRight = null;

    //->数据绑定
    $matchPlan.add(function (matchInfo) {
        var template = $('#matchTemplate').html(),
            result = ejs.render(template, {matchInfo: matchInfo});
        $match.html(result);

        //->数据绑定完成后获取需要的元素
        $progress = $match.find('.progress');
        $supportLeft = $match.find('.supportLeft');
        $supportRight = $match.find('.supportRight');
    });

    //->计算进度条
    $matchPlan.add(computedProgress);
    function computedProgress(flag) {
        var leftNum = parseFloat($supportLeft.html()),
            rightNum = parseFloat($supportRight.html());
        $progress.css('transition', '1s');
        window.setTimeout(function () {
            $progress.css('width', (leftNum / (leftNum + rightNum)) * 100 + '%');
        }, flag === false ? 0 : 500);
    }

    //->点击支持
    var isTap = false;
    $matchPlan.add(function () {
        var supportInfo = localStorage.getItem('supportInfo');
        if (supportInfo) {
            supportInfo = JSON.parse(supportInfo);
            supportInfo.type == 1 ? $supportLeft.addClass('bg') : $supportRight.addClass('bg');
            return;
        }
        $supportLeft.add($supportRight).tap(function () {
            if (isTap) return;

            //->在原来基础上数字累加1&让当前点击的元素有选中的样式
            var num = parseFloat($(this).html());
            num++;
            $(this).html(num).addClass('bg');

            //->让是否点击过的标识为TRUE,这样下次再点击就不在操作了,点击完成后重新的计算一下当前的进度
           isTap=true;
            computedProgress(false);

            //->告诉服务器我支持的是谁
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1469151&type=' + $(this).attr('data-type'),
                type: 'get',
                dataType: 'jsonp'
            });

            //->向本地存储一些信息,下一次打开页面判断信息是否存在,存在的话不让在点击支持了,而且上一次点击的是谁,让谁有选中的样式
            var obj = {
                type: $(this).attr('data-type')
            };
            localStorage.setItem('supportInfo', JSON.stringify(obj));
        });
    });

    return {
        init: function () {
            //->获取数据,JSONP从腾讯的服务器上获取数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1469151',
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    //->数据的格式化操作:
                    //把服务器返回的数据格式化成为我们所需要的数据
                    if (result && result[0] == 0) {
                        result = result[1];
                        var matchInfo = result['matchInfo'];
                        matchInfo['leftSupport'] = result['leftSupport'];
                        matchInfo['rightSupport'] = result['rightSupport'];
                        $matchPlan.fire(matchInfo);//->通知计划表中的任务执行,把获取的数据传递给计划表中的每一个方法
                    }
                }
            });
        }
    }
})();
matchRender.init();