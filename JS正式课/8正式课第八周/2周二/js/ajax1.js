((function () {
    function ajax(opt) {
        //首先判断传进来的是不是一个对象
        if (!tools.isType(opt, 'Object')) {
            throw new TypeError('参数不正确');
        }
        var xhr = tools.getXHR();
        //默认参数
        var url = opt.url||'/';
        var method = opt.method ||'get';
        var async = !!(opt.async===undefined?true:opt.async);
        var isGet = /^get|head|delete/i.test(method);
        var data = opt.data;//先格式化往服务器端传递的参数
        //get系方法影响着传参方式，和是否需要清理缓存
        if (isGet && data){
            data = tools.param(opt.data);
            //将url与传进来的data进行传参。
            url = tools.appendToURL(url,data);
            data = null;
        }
        //是否清理缓存
        if(isGet && opt.catch===false){
            var rand = Math.random();
            url = tools.appendToURL(url,'_='+rand)
        }
        xhr.open(method,url,async);
        xhr.onreadystatechange=function(){
            if (xhr.readyState===4){
                var result = xhr.responseText;
                if (/^2\d{2}/.test(xhr.status)||xhr.status===304){
                    if (opt.dataType==='json'){
                        result = tools.JSONParse(result);
                        try {
                            typeof opt.success=='function'&&opt.success.call(xhr,result)
                        }catch (e){
                            typeof opt.error==='function'&&opt.error.call(xhr,e)
                        }
                    }
                }
            }else {
                typeof opt.error==='function'&&opt.error.call(xhr,xhr.status)

            }
        };
        if (/^post|put/i.test(method)){
            if (tools.isType(data,'Object')){
                data=JSON.stringify(data);
                xhr.send(data)
            }
        }else {
        xhr.send(data)
        }
    }
    var tools = {
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']'
        },
        getXHR: (function () {
                var list = [
                    function(){
                        return new XMLHttpRequest;
                    },
                    function(){
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    },
                    function(){
                        return new ActiveXObject('Msxml2.XMLHTTP');
                    },
                    function(){
                        return new ActiveXObject('Msxml3.XMLHTTP');
                    }
                ];
            var xhr = null;
            while (xhr=list.shift()){
                try {
                    xhr();
                    return xhr;
                }catch (e){

                }
            }
            throw new ReferenceError('浏览器不支持ajax功能')
        }()),
        param:function(data) {
            //字符串
            if(tools.isType(data,'String')){
                return data
            }
            if (data===null||data===undefined){
                return ''
            }
            if (tools.isType(data,'Object')) {
                var ary = [];
                for(var key in data){
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key+'='+data[key])
                }
                return ary.join('&')
            }
            return String(data);
        },
        appendToURL:function(url,padString){
            var flag = /\?/.test(url);
           return url=url+(flag?'&':'?')+padString
        },
        JSONParse:function(jsonString){
            return 'JSON' in  window ?JSON.parse(jsonString):eval('('+jsonString+')');
        }
    };

    window.ajax = ajax;
})());
