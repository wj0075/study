((function(pro){
    function queryFarm(){
        var reg = /([^?=&#]+)=([^?=&#]+)/gi;
        var obj = {};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2]
        });
        return obj;
    }
    pro.queryFarm = queryFarm;
})(String.prototype));

var username = document.getElementById('username');
var submit = document.getElementById('submit');
var customId = window.location.href.queryFarm()['id'];
if (customId){
    ajax({
        url:'getInfo?id='+customId,
        method:'get',
        dataType:'json',
        success: function (result) {
            if (result && result.code==0){
                username.value=result.data['name'];
            }
        }
    })
}
submit.onclick=function(){
        var obj={
            name:username.value
        };
    if (customId){
        obj={
            id:customId,
            name:username.value
        };
        ajax({
            url:'/updateInfo',
            method:'post',
            dataType:'json',
            data:obj,
            success:function(result){
                if (result && result.code==0){
                    location.href='index.html'
                }
            }
        });
        return;
    }

    ajax({
        url:'/addInfo',
        method:'post',
        dataType:'json',
        data:obj,
        success:function(result){
            if (result && result.code==0){
                location.href='index.html'
            }
        }
    })

};
