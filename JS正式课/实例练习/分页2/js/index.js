var studentRender = (function () {
    var page = document.getElementById('page'),
        con = document.getElementById('con'),
        pageNum = document.getElementById('pageNum'),
        inp = document.getElementById('text');
    var n=1,
        total=0,
        data=null;
    function init() {
        sendAjax();
        bindEvent();
    }
    function sendAjax() {
        ajax({
            url:'/getList?n='+n,
            success:function (result) {
                if (result && result.code==0){
                    total = result.totals;
                    data = result.data;
                    bind()
                }
            }
        })
    }
    function bind(){
        var stuTemplate = document.getElementById('stuTemplate'),
            template = stuTemplate.innerHTML;
        var res = ejs.render(template,{stuData:data});
        con.innerHTML=res;
        var pageTemplate = document.getElementById('pageTemplate'),
            numTemplate = pageTemplate.innerHTML;
        var res1 = ejs.render(numTemplate,{pageData:total});
        pageNum.innerHTML=res1;
        inp.value=n;
    }
    function bindEvent() {
        page.onclick=function (e) {
            e = e||window.event;
            var target = e.target||e.srcElement,
                tar = target.tagName.toLowerCase(),
                tarInn = target.innerHTML;
            if (tar==='span'){
                switch (tarInn){
                    case '首页':
                        n=1;
                        break;
                    case '上一页':
                        if (n<=1){return}else (n--);
                        break;
                    case '下一页':
                        if (n>=total){return}else (n++);
                        break;
                    case '尾页':
                        n=total
                }
            }
            if (tar==='li'){
                if (n===parseFloat(tarInn)){
                    return
                }
                n=parseFloat(tarInn);
            }

            sendAjax();
        }
    }


    return {
        init:init
    }

})();
studentRender.init();