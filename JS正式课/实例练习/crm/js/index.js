var list = document.getElementById('list');
var customer = (function () {
    function init() {
        ajax({
            url: '/getList',
            type: 'get',
            success: function (result) {
                if (result && result.code == 0) {
                    bind(result.data)
                    remove();
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
        list.innerHTML = str;
    }

    function remove() {
        list.onclick = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                tar = target.tagName.toLowerCase();
            if (tar === 'a' && target.innerHTML === '删除') {
                var customId = target.getAttribute('data-id');
                var flag = confirm('您确定要删除编号为' + customId + '的用户吗？');
                if (flag) {
                    ajax({
                        url: '/removeInfo?id=' + customId,
                        success: function (result) {
                            if (result && result.code==0){
                                list.removeChild(target.parentNode.parentNode);
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
customer.init();