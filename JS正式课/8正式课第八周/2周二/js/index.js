var oList = document.getElementById('list');
var customPoe = ((function () {
    function init() {
        ajax({
            url: '/getList',
            method: 'get',
            dataType: 'json',
            success: function (result) {
                if (result && result.code == 0) {
                    bind(result.data);
                    //删除
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
        oList.innerHTML = str;
    }

    function remove() {
        oList.onclick = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                tar = target.tagName.toLowerCase();
            if (tar === 'a' && target.innerHTML === '删除') {
                var customId = target.getAttribute('data-id');
                var flag = window.confirm('确定要删除编号为' + customId + '的信息吗？');

                if (flag){
                    ajax({
                        url: '/removeInfo?id=' + customId,
                        dataType: 'json',
                        success: function (result) {
                            if (result && result.code == 0) {
                                console.log(result);
                                    oList.removeChild(target.parentNode.parentNode);
                                    return;
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

})());
customPoe.init();

