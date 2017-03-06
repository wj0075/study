var oList = document.getElementById('list');
var customOpe = (function () {
    function init() {
        //1获取数据 绑定数据
        ajax({
            url: '/getList',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data && data.code == 0) {
                    bind(data.data);
                    //删除
                    removeCus();

                }
            }
        })
    }

    function bind(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li>\
            <span class="w100">' + cur.id + '</span>\
            <span class="w100">' + cur.name + '</span>\
            <span class="w150">\
            <a href="add.html?id=' + cur.id + '">修改</a>\
            <a href="javascript:;" data-id="' + cur.id + '">删除</a>\
            </span>\
            </li>';
        }
        oList.innerHTML = str;
    }

    function removeCus() {
        oList.onclick = function (e) {
            e || window.event;
            var target = e.target || e.srcElement,
                tar = target.tagName.toLowerCase();

            if (tar === 'a' && target.innerHTML === '删除') {
                var customId = target.getAttribute('data-id');
                var flag = window.confirm('确定要删除编号为' + customId + '的用户吗？');
                if (flag) {
                    ajax({
                        url: '/removeInfo?id=' + customId,
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            if (data && data.code == 0) {
                                oList.removeChild(target.parentNode.parentNode);
                            }
                        }
                    })
                }
            }
        }
    }

    return {
        init: init
    }

})();
customOpe.init();