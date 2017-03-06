var pageModule = (function () {
    //获取需要操作的DOM元素，
    var content = document.getElementById('con'),
        page = document.getElementById('page'),
        pageNum = document.getElementById('pageNum'),
        inp = document.getElementById('numInp');
    //-设定当前页和总页数
    var n = 1,
        total = 0,
        data = null;
    //模块入口
    function init() {
        sendAjax();
        bindEvent();
    }
    function sendAjax() {
        ajax({
            url: 'getList?n=' + n,
            dataType: 'json',
            success: function (result) {
                if (result && result.code == 0) {
                    total = result['total'];
                    data = result.data;
                    bind();
                    bindLink();
                }
            }
        })
    }
    //页面数据绑定
    function bind() {
        //数据绑定
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li studentId="' + cur.id + '">\
                    <span>' + cur.id + '</span>\
                    <span>' + cur.name + '</span>\
                    <span>' + (cur.sex == 1 ? '女' : '男') + '</span>\
                    <span>' + cur.score + '</span>\
                    </li>';
        }
        content.innerHTML = str;
        //绑定的是页码的个数
        str = '';
        for (i = 1; i <= total; i++) {
            if (i == n) {
                str += '<li class="on">' + i + '</li>';
                continue;
            }
            str += '<li>' + i + '</li>';
        }
        pageNum.innerHTML = str;
        //文本框中的
        inp.value = n;
    }

    //事件委托实现分页按钮操作  &&给文本框的enter绑定事件
    function bindEvent() {
        page.onclick = function (e) {
            e = e || window.event;
            var tar = e.target || e.srcElement,
                target = tar.tagName.toLowerCase(),
                tarInn = tar.innerHTML;
            //包含了 第一页 上一页  下一页 尾页
            if (target === 'span') {
                if (tarInn === '首页') {
                    if (n === 1) {
                        return
                    }
                    n = 1;
                } else if (tarInn === '尾页') {
                    if (n === total) {
                        return;
                    }
                    n = total;
                } else if (tarInn === '上一页') {
                    if (n === 1) {
                        return;
                    }
                    n--;
                } else if (tarInn === '下一页') {
                    if (n === total) {
                        return
                    }
                    n++;
                }
            }
            if (target === 'li') {
                if (n === parseFloat(tarInn)) {
                    return;
                }
                n = parseFloat(tarInn);
            }
            if (target === 'input') {
                return;
            }
            //已经知道N了 重新发送请求，重新绑定
            sendAjax();
        };
        inp.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode === 13) {
                var val =parseFloat(this.value.replace(/^ +| +$/, ''));
                val = Math.round(val);
                if (isNaN(val)) {
                    this.value = n;
                    return;
                } else if (val < 1) {
                    n = 1;
                } else if (val > total) {
                    n = total;
                } else {
                    n = val;
                }
                sendAjax();
            }
        };
        
    }
    //bindLink:content区域的li跳转事件
    function bindLink() {
        var aLis = content.getElementsByTagName('li');
        for (let i=0;i<aLis.length;i++){
            aLis[i].onclick=function () {
                //window.location.href = 'show.html';
                //再跳转的时候把当前学员的id传到详细页
                window.open("show.html?id="+this.getAttribute('studentId' ))
            }
        }
    }
    return {
        init: init
    }
})();
pageModule.init();