(function (pro) {
    function formatUrlQuery() {
        var reg = /([^=?&#]+)=([^=?&#]+)/gi;
        var obj = {};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2];
        });
        return obj
    }
    pro.formatURLQuery=formatUrlQuery;
})(String.prototype);

var btn = document.getElementById('submit');
var customName = document.getElementById('username');
var customId = location.href.formatURLQuery()['id'];
if (customId){
    ajax({
        url:'/getInfo?id='+customId,
        success:function (result) {
            if (result && result.code==0){
                customName.value=result.data.name
            }
        }
    })

}
submit.onclick=function () {
  var data = {
      name:customName.value
  };
  if (customId){
      data={
          id:customId,
          name:customName.value
      };
      ajax({
          url:'/updateInfo',
          type:'put',
          data:data,
          success:function (result) {
            if (result&&result.code==0){
                location.href='index.html'
            }
          }
      });
    return
  }
  ajax({
      url:'/addInfo',
      type:'post',
      data:data,
      success:function (result) {
          if (result && result.code==0){
              location.href = 'index.html'
          }
      }
  })
};