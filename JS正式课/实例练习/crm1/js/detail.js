(function (pro) {
    function formatURLQuery() {
        var reg = /([^=?#&]+)=([^=?#&]+)/gi;
        var obj = {};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2]
        });
        return obj;
    }
    pro.formatURLQuery=formatURLQuery;
})(String.prototype);


var userName = document.getElementById('user'),
    submit = document.getElementById('submit');
var customId=location.href.formatURLQuery()['id'];
if (customId){
    ajax({
        url:'/getInfo?id='+customId,
        success:function (result) {
            if (result && result.code==0){
                userName.value=result.data['name']
            }
        }
    })
}
submit.onclick=function () {
    var obj = {
        name:userName.value
    };
    if (customId){
         obj={
            id:customId,
            name:userName.value
        };
        ajax({
            url:'updateInfo',
            type:'post',
            data:obj,
            success:function (result) {
                if (result && result.code==0){
                    location.href = 'index.html';
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
           if(result && result.code==0){
                location.href = 'index.html';
            }
        }
    })
};



