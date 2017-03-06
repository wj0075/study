//封装一个方法
~function(pro){
   function queryFarm(){
       var reg = /([^?=&#]+)=([^?=&#]+)/gi;
       var obj = {};
       this.replace(reg,function(){
           obj[arguments[1]]=arguments[2];
       });
       return obj;
   }
    pro.queryFarm = queryFarm;
}(String.prototype);
var username = document.getElementById('username');
var submit = document.getElementById('submit');
//先根据url地址来获取到地址中的id，
//先获取url
var customId = window.location.href.queryFarm()['id'];
if (customId){
    ajax({
        url:'/getInfo?id='+customId,
        type:'get',
        dataType:'json',
        success:function(result){
           if (result && result.code==0){
               username.value = result.data['name'];
           }
        }
    })
}
var obj = {
    name:username.value
}  ;
submit.onclick=function(){

    if (customId){
        obj={
            name:username.value,
            id:customId
        };
        console.log(obj);
        ajax({
            url:'/updateInfo',
            type:'post',
            dataType:'json',
            data:obj,
            success:function(result){
                if (result && result.code==0){
                    location.href='CRM.html';
                }
            }
        });
        return;
    }
   ajax({
       url:'/addInfo',
       type:'post',
       dataType:'json',
       data:obj,
       success:function (result){
        if (result && result.code==0){
            location.href = 'CRM.html';
        }
    }
   })


};



