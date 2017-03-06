~function(){
    var content = document.getElementById('content');
    ajax({
        url:'/getAllList',
        type:'get',
        dataType:'json',
        success:function(result){
            if (result && result.code===0){
                bind(result.data);
            }
        }
    });
   function bind(data){
       var str = '';
       for (var i=0;i<data.length;i++){
           var cur = data[i];
           str+='<li>\
               <span>'+cur.id+'</span>\
               <span>'+cur.name+'</span>\
               <span>\
               <a href="detail.html?id='+cur.id+'">修改</a>\
               <a href="javascript:;" data-id="'+cur.id+'">删除</a>\
               </span>\
               </li>'
       }
       //开始绑定的时候，就把客户的ID存储到自定义属性上，这样后期点击的时候想知道它代表哪个客户的话。直接获取自定义i属性值即可
        content.innerHTML=str;
   }
    //使用事件委托来实现删除操作
    content.onclick = function(e){
        e = e || window.event;
        var target = e.target || e.srcElement,
            tar = target.tagName.toLowerCase();
        if (tar=='a' && target.innerHTML=='删除'){
            //alert('ok')；
            //只有确认按钮
            //confirm();有取消按钮
            //prompt();在确认的基础上增加输入的操作--可填写操作的原因。
            //提示框组件插件
            var customID = target.getAttribute('data-id');
            var flag = window.confirm('确认要删除编号为['+customID+']的客户吗？');
            if (flag){
                ajax({
                    url:'/removeInfo?id='+customID,
                    type:'get',
                    dataType:'json',
                    success:function(result){
                        if (result && result.code==0){
                            content.removeChild(target.parentNode.parentNode);
                            alert('删除成功')
                        }
                    }
                })
            }
        }
    }
}();