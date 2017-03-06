~function(pro){
    function queryURLParameter(){
        var reg = /([^?&=#]+)=([^?&=#]+)/g;
        var obj = {};
        this.replace(reg,function(){
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);
~function(){
    //获取当前页面的URL地址，然后把问号传递过来的参数值获取到
    var curURL = window.location.href,
        urlObj = curURL.queryURLParameter(),
        customId = urlObj['id'];
    //如果是修改的话，我们需要把对应ID的客户信息获取到，然后展示到对应的文本框中。
    var submit=document.getElementById('submit');
    var name = document.getElementById('userName');
    if (typeof customId!=='undefined'){
        ajax({
            url:'/getInfo?id='+customId,
            type:'get',
            dataType:'json',
            success:function(result){
                if (result && result.code==0){
                    name.value = result.data['name'];
                }
            }
        })
    }
    submit.onclick=function(){
        var obj = {
            name:name.value
        };
        //修改
        if(customId){
            obj = {
                id:customId,
                name:name.value
            };
            ajax({
                url:'/updateInfo',
                type:'post',
                dataType:'json',
                data:obj,/*{id:customId,name:name.value}*/
                success:function(result){
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
            dataType:'json',
            data:obj,
            success:function(result){
                if (result && result.code==0){
                    location.href = 'index.html';
                    return;
                }
            }
        })
    }
}();