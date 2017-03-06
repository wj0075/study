((function(){
    function ajax(opt){
        if (typeof opt!=='object'){
            throw new TypeError('参数不正确')
        }
        var _default = {
             url:'/',
            method:'get',
            async:true,
            catch:true,
            data:null,
            dataType:'text',
            success:null,
            error:null
        };
        for (var key in opt){
          if (!opt.hasOwnProperty(key)) continue;
            _default[key]=opt[key];
        }
        var xhr =new XMLHttpRequest;
        if (/^get|delete|head/i.test(_default.method)){
            if (_default.catch===false){
                var char = _default.url.indexOf('?')>-1?'&':'?';
                _default.url+=char+'_='+Math.random();
            }
        }
        xhr.open(_default.method,_default.url,_default.async);
        xhr.onreadystatechange=function(){
            if (xhr.readyState===4){
                if (xhr.status===200){
                    var result = xhr.responseText;
                    switch (_default.dataType){
                        case 'json':
                            result='JSON' in window?JSON.parse(result):eval('('+result+')');
                            break;
                        case 'xml':
                            result = xhr.responseXML;
                            break;
                    }
                 typeof _default.success==='function'&&_default.success.call(xhr,result);
                }
            }else {

                typeof _default.error ==='function'&&_default.error.call(xhr,xhr.status)
            }
        };
        if (/^post|put/i.test(_default.method)){
          if (typeof _default.data=='object'){
              _default.data = JSON.stringify(_default.data);
              xhr.send(_default.data)
          }
        }else {
            xhr.send(null);
        }
    }

    window.ajax = ajax;

})());