((function (pro) {
    function queryParam() {
        var reg = /([^?&#=]+)=([^?=&#]+)/gi;
        var obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2]
        });
        return obj;
    }

    pro.queryFarm = queryParam;

})(String.prototype));

var customId = window.location.href.queryFarm().id;
var submit = document.getElementById('submit');
var username = document.getElementById('con');
if (customId) {
    ajax({
        url: '/getInfo?id=' + customId,
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data && data.code == 0) {
                username.value = data.data.name
            }
        }
    })
}
submit.onclick = function () {
    var obj = {
        name: username.value
    };
    if (customId) {
        obj = {
            id: customId,
            name: username.value
        };
        ajax({
            url: 'updateInfo',
            type: 'post',
            dataType: 'json',
            data:obj,
            success: function (data) {
                if (data && data.code == 0) {
                    window.location.href = 'index.html';
                }
            }
        });
        return
    }
    ajax({
        url: '/addInfo',
        type: 'post',
        dataType: 'json',
        data: obj,
        success: function (data) {
            if (data && data.code == 0) {
                window.location.href = 'index.html'
            }
        }
    })


};


