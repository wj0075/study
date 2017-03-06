(function (pro) {
    function param() {
        var reg = /([^?=&#]+)=([^?=&#]+)/gi;
        var obj={};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.param = param;
})(String.prototype);
var customId = location.search.param()['id'];
var submit = document.getElementById('submit');
var username = document.getElementById('user');
if (customId){
    ajax({
        url:'getInfo?id='+customId,
        success:function (result) {
            if (result && result.code==0){
                username.value = result.data['name'];
            }
        }


    })
}

submit.onclick=function () {
    var obj = {
        name:username.value
    };
    if (customId){
        obj ={
            id:customId,
            name:username.value
        };
        ajax({
           url:'updateInfo',
            type:'post',
            data:obj,
            success:function (result) {
                if (result && result.code==0){
                    window.location.href = 'index.html';
                }
            }
        });
        return;
    }


    ajax({
        url:'/addInfo',
        type:'post',
        data:obj,
        success:function (result) {
            console.log(result);
            if (result && result.code==0){
                window.location.href = 'index.html';
            }
        }
    })




};


