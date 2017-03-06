(function (pro) {
    function queryURL() {
        var reg = /([^?=&#]+)=([^?=&#]+)/gi;
        var obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2]
        });
        return obj
    }

    pro.queryURL = queryURL;
})(String.prototype);

var customId = location.href.queryURL()['id'];
var username = document.getElementById('user'),
    submit = document.getElementById('submit');
if (customId) {
    ajax({
        url: '/getInfo?id='+customId,
        success: function (result) {
            if (result && result.code == 0) {
                username.value = result.data.name;
            }
        }
    })
}
submit.onclick = function () {
    var obj = {
        name: username.value
    };
    if (customId){
        obj = {
            id:customId,
            name:username.value
        };
        ajax({
            url:'/updateInfo',
            type:'post',
            data:obj,
            success:function (result) {
                if (result && result.code == 0) {
                    location.href = 'index.html';
                }
            }
        });
        return;
    }
        ajax({
            url: '/addInfo',
            type: 'post',
            data: obj,
            success: function (result) {
                console.log(result);
                if (result && result.code == 0)
                    location.href = 'index.html';
            }
        })
};
