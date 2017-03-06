(function (pro) {
    function param() {
        var reg = /([^&?=#]+)=([^&?=#]+)/gi;
        var obj = {};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2]
        });
        return obj;
    }
    pro.param=param;
})(String.prototype);
var customId = location.href.param()['id'];
if (customId){
    ajax({
        url:'/getInfo?id='+customId,
        method:'get',
        success:function (result) {
            if (result && result.code==0){
                text.value = result.data['name'];
            }
        }
    })


}


var submit = document.getElementById('submit');
var text = document.getElementById('text');
submit.onclick=function () {
    var obj = {
        name:text.value
    };
    if (customId){
        obj = {
            id:customId,
            name:text.value
        };
        ajax({
            url:'/updateInfo',
            method:'post',
            data:obj,
            success:function (result) {
                if (result && result.code==0){
                    location.href = 'index.html'
                }
            }
        });
        return;
    }
  ajax({
      url:'/addInfo',
      method:'post',
      data:obj,
      success:function (result) {
          if (result && result.code==0){
              location.href = 'index.html'
          }
      }
  })
};





