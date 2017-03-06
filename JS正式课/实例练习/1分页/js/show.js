(function (pro) {
    function param() {
        var reg = /([^?&=#]+)=([^?&=#]+)/gi;
        var obj={};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2]
        });
        return obj;
    }
    pro.param = param;
})(String.prototype);
var studentId = location.search.param()['id'];
var id = document.getElementById('id');
var name1 = document.getElementById('na');
var sex = document.getElementById('sex');
var score = document.getElementById('score');
ajax({
   url:'/getInfo?id='+studentId,
    type:'get',
    dataType:'json',
    success:function (result) {
        if (result && result.code==0){
            id.innerHTML = result.data['id'];
            name1.innerHTML = result.data['name'];
            sex.innerHTML = result.data['sex']===0?'男':'女';
            score.innerHTML = result.data['score'];
        }
    }
});




