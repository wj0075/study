((function () {
    function ajax(opt) {
        if (Object.prototype.toString.call(opt)!=='[object Object]'){
            throw new TypeError('参数不正确')
        }
        var _default = {
            url:'/',
            type:'get',
            async:true,
            data:null,
            dataType:'json',
            catch:true,
            success:null,
            error:null
        };
        for (var key in opt){
          if (!opt.hasOwnProperty(key)) continue;
          _default[key] = opt[key];
        }
        var xhr = new XMLHttpRequest;
        var isGet = /^get|head|delete/i.test(_default.type);
        if (isGet && _default.catch===false){
            var char = _default.url.indexOf('?')===-1?'?':'&';
            _default.url+=char+'_='+Math.random();
        }
        xhr.open(_default.type,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if (xhr.readyState===4){
                if(xhr===200){
                    var result = xhr.responseText;
                    switch (_default.dataType){
                        case 'json':
                            result = 'JSON' in window ?JSON.parse(result):eval('('+result+')');
                            break;
                        case 'xml':
                            result = xhr.responseXML;
                    }
                    _default.success && _default.success.call(xhr,result);
                }else {
                    _default.error && _default.error.call(xhr,result);
                }
            }
        };
        if (/^post|put/i.test(_default.type)){
            if (Object.prototype.toString.call(_default.data)==='[object Object]') {
                xhr.send(JSON.stringify(_default.data))
            }
        }else {
            xhr.send(null);
        }
    }
    this.ajax = ajax;
})());
