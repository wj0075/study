~function (pro) {
    function formatDate(temp) {
        var ary = this.match(/\d+/g);
        var tempStr = temp || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        tempStr = tempStr.replace(/{(\d+)}/g,function () {
            var chart = parseFloat(ary[arguments[1]]);
            chart=chart>10?chart:'0'+chart;
            return chart;
        });
        return tempStr;
    }
    pro.formatDate = formatDate;
}(String.prototype);
/*--nav-*/
var navRender = (function () {
    var $header = $('.header'),
        $menu = $header.children('.menu'),
        $nav = $('.nav');
    var isBlock = false;

    return {
        init:function () {
            $menu.tap(function () {
                if (!isBlock){
                    $nav.css({
                        padding:'.1rem 0',
                        height:'2.22rem'
                    });
                    isBlock=true;
                }else {
                    isBlock = false;
                    $nav.css({
                        padding:'0',
                        height:'0'
                    });
                }
            })
        }
    }
})();
navRender.init();
/*--match--*/
var matchRender=(function () {
    var $matchPlan = $.Callbacks();
    var $match = $('.match');
    var $progress = null,
        $supportL=null,
        $supportR=null;
    $matchPlan.add(function (matchInfo) {
        //数据绑定
        var $matchTemplate=$('#matchTemplate');
        var template = $matchTemplate.html();
        var res=ejs.render(template,{matchInfo:matchInfo});
        $match.html(res);
            $progress = $('.progress');
            $supportL = $('.supportL');
            $supportR = $('.supportR');
    });
    $matchPlan.add(computedProgress);
    function computedProgress(flag) {
        var leftNum = parseFloat($supportL.html());
        var rightNum = parseFloat($supportR.html());
        $progress.css('transition','1s');
        window.setTimeout(function () {
            $progress.css('width',(leftNum/(leftNum+rightNum))*100+'%');
        },flag===false?0:500)
    }
    var isTap=false;
    $matchPlan.add(function () {
        var supportType = localStorage.getItem('dataType');
        if (supportType){
            supportType = JSON.parse(supportType);
            supportType.name==1?$supportL.addClass('bg'):$supportR.addClass('bg');
            return
        }
       $supportR.add($supportL).tap(function () {
           if (isTap) return;
          var num = parseFloat($(this).html());
           num++;
           $(this).html(num).addClass('bg');
           //这次在进行进度条的更新，就不必在等待500ms了。可以在这里传进去一个布尔值，在函数中进行判断
           isTap=true;
           computedProgress(false);
           //获取到的新数据，要传递给服务器，告诉服务器我支持的是谁（因为只能点击一次，所以在服务器端只要给他传递了支持的方面，服务器端自动给这方加1即可，所以不用传递具体的数）。因为要判断是哪个方向增加的数字，所以给这两个元素增加一个自定义属性。来表明自己的身份
           $.ajax({
               url:'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1469151&type='+$(this).attr('data-type'),
               type:'get',
               dataType:'jsonp'
           });
           // 解决一个账号只能点击一次，在页面刷新后，也不能在点击，并且让选中样式在原先点击的那个身上
           var obj = {
               name:$(this).attr('data-type')
           };
           localStorage.setItem('dataType',JSON.stringify(obj));
       });


    });

    return {
        init:function () {
            //获取数据，jsonp从腾讯的服务器上获取数据
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1469151',
                type:'get',
                dataType:'jsonp',
                success:function (result) {
                    //数据的格式化操作：把服务器返回的数据格式化成为我们所需要的数据
                    if (result && result[0]==0){
                        result = result[1];
                        var matchInfo = result['matchInfo'];
                        matchInfo['rightSupport']=result['rightSupport'];
                        matchInfo['leftSupport']=result['leftSupport'];
                        $matchPlan.fire(matchInfo);//通知计划表中的任务执行，
                    }
                }
            })



        }
    }
})();
matchRender.init();

/*--player--*/
var playerRender = (function () {
    var $wrapper = $('.wrapper');
    var playerPlan = $.Callbacks();
    /*--绑定数据--*/
    playerPlan.add(function (data) {
        var template = $('#playerTemplate').html();
        var res = ejs.render(template,{playerData:data});
        $wrapper.html(res);
        $wrapper.css('width',data.length*2.4+'rem');
        var playSrcoll = new IScroll('.player',{
            scrollX:true
        });
    });

    return {
        init:function () {
            $.ajax({
                url:'http://matchweb.sports.qq.com/html/matchStatV37?mid=100000:1469151',
                type:'get',
                dataType:'jsonp',
                success:function (result) {
                    if (result && result[0]==0){
                        var data = result[1].stats;
                        for (var i=0;i<data.length;i++){
                            var cur = data[i];
                            for (var key in cur){
                                if (cur[key]==9){
                                    var endData = cur['list'];
                                }
                            }
                        }
                        playerPlan.fire(endData);
                    }
                }
            })
        }
    }


})();
playerRender.init();

