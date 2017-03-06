(function () {
    function ajax(opt) {
        if (Object.prototype.toString.call(opt)!='[object Object]'){
            throw new TypeError('参数不正确')
        }
        var _default = {
            type:'get',
            url:'/',
            async:true,
            catch:true,
            data:null,
            dataType:'json',
            success:null,
            error:null
        };
        for (var key in opt){
            if (!opt.hasOwnProperty(key)) continue;
            _default[key]=opt[key];
        }
        var xhr = new XMLHttpRequest;
        if (/^get|head|delete$/gi.test(_default.type)&&_default.catch==false){
            var char = _default.url.indexOf('?')===-1?'?':'&';
            _default.url+=char+'_='+Math.random();
        }
        xhr.open(_default.type,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if (xhr.readyState===4){
                if (xhr.status===200){
                    var result = xhr.responseText;
                    if (_default.dataType=='json'){
                        result = 'JSON' in window ? JSON.parse(result):eval('('+result+')')
                    }
                    _default.success && _default.success.call(xhr,result);
                }else {
                    _default.error && _default.error.call(xhr,xhr.status)
                }
            }
        };
        if (/^post|put$/gi.test(_default.type) && typeof _default.data=='object'){
            xhr.send(JSON.stringify(_default.data))
        }else {
            xhr.send(null);
        }
    }
    this.ajax=ajax;
})();