var alist = document.getElementById('list');
var customOpe = (function(){
    function init(){
       ajax({
           url:'/getAllList',
           typeL:'get',
           dataType:'json',
           success:function(result){
              if (result && result.code==0){
                  //数据绑定
                  bind(result.data)
                  //删除客户信息
                  removeCustom();

              }
           }
       })
    };
    function bind(data){
        var str = '';
        for (var i=0;i<data.length;i++){
            var cur = data[i];
            str+='<li>\
                <span class="w100">'+cur.id+'</span>\
                <span class="w100">'+cur.name+'</span>\
                <span class="w150">\
                <a href="add.html?id='+cur.id+'">修改</a>\
                <a href="javascript:;" data-id="'+cur.id+'">删除</a>\
                </span>\
                </li>';
        }
        alist.innerHTML = str
    }
    function removeCustom(){
        alist.onclick=function(e){
            e = e || window.event;
            var target = e.target||e.srcElement,
                tar =target.tagName.toLowerCase();
            var customId = target.getAttribute('data-id');
            if (tar==='a' && target.innerHTML =='删除'){
                ajax({
                    url:'/removeInfo?id='+customId,
                    type:'get',
                    dataType:'json',
                    success:function(result){
                        if (result && result.code==0){
                            alist.removeChild(target.parentNode.parentNode)
                        }

                    }
                })



            }



        }


    }
    return {
        init:init
    }

})();
customOpe.init();