(function () {
    function ajax(opt) {
        if (!Object.prototype.toString.call(opt)==='[object Object]') return;
        var _default = {
            url:'/',
            method:'get',
            async:true,
            data:null,
            dataType:'json',
            catch:true,
            success:null,
            error:null
        };
        var isGet = /get|delete|head/i.test(_default.method);
        for (var key in opt){
            if (!opt.hasOwnProperty(key)) continue;
            _default[key]=opt[key];
        }
        var xhr = new XMLHttpRequest;
        if (isGet && _default.catch===false){
            var char = _default.url.indexOf('?')===-1?'?':'&';
            _default.url+=char+'_='+Math.random();
        }
        xhr.open(_default.method,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if (xhr.readyState===4){
                if (xhr.status===200){
                    var result = xhr.responseText;
                    switch (_default.dataType){
                        case 'json':
                            result = 'JSON' in window?JSON.parse(result):eval('('+result+')');
                            break;
                        case  'xml':
                            result = xhr.responseXML
                    }
                    _default.success && _default.success.call(xhr,result);
                }else {
                    _default.error && _default.error.call(xhr,xhr.status)
                }
            }
        };
        if (/post|put/i.test(_default.method) && typeof _default.data=='object'){
            _default.data = JSON.stringify(_default.data);
            xhr.send(_default.data)
        }else {
            xhr.send(null);
        }
    }




    this.ajax=ajax;
})();
