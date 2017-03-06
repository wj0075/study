(function () {
    function ajax(opt) {
        if (Object.prototype.toString.call(opt) !== '[object Object]') {
            throw new TypeError('参数不正确');
        }
        var _default = {
            url: '/',
            type: 'get',
            catch: true,
            data:null,
            typeData: 'json',
            success: null,
            error: null
        };
        for (var key in opt) {
            if (opt.hasOwnProperty(key)) {
                _default[key] = opt[key]
            }
        }
        var xhr = new XMLHttpRequest;
        if (/^(get|delete|head)$/i.test(_default.type)){
            if (_default.catch===false){
                var chat = _default.url.indexOf('?')==-1?'?':'&';
                _default.url+=chat+'_='+Math.random()
            }
        }
        xhr.open(_default.type, _default.url, true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onreadystatechange=function () {
            if (xhr.readyState==4){
                if (xhr.status==200){
                    var data = xhr.responseText;
                    if (_default.typeData=='json'){
                        data = 'JSON' in window?JSON.parse(data):eval('('+data+')')
                    }
                    _default.success && _default.success.call(xhr,data);
                }else {
                   _default.error && _default.error(xhr.status)
                }
            }
        };
        if (/^(post|put)$/i.test(_default.type)){
            if (Object.prototype.toString.call(_default.data) == '[object Object]'){
                xhr.send(JSON.stringify(_default.data))
            }
        }else {
            xhr.send()
        }
    }
    this.ajax = ajax;
})();
