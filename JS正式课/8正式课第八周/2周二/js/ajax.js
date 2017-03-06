((function () {
    function ajax(opt) {
        if (Object.prototype.toString.call(opt) !== '[object Object]') {
            throw new TypeError('参数不正确');
        }
        var _default = {
            method: 'get',
            async: true,
            catch: true,
            success: null,
            error: null,
            dataType: 'text',
            url: '/',
            data: null
        };
        for (var key in opt) {
            if (!opt.hasOwnProperty(key)) continue;
            _default[key] = opt[key]
        }
        var xhr = new XMLHttpRequest;
        if (/^get|head|delete&/i.test(_default.method)) {
            if (_default.catch === false) {
                var rend = Math.random();
                var char = _default.url.indexOf('?') !== -1 ? '&' : '?';
                _default.url += char + '_=' + rand;
            }
        }
        xhr.open(_default.method, _default.url, _default.async)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var result = xhr.responseText;
                if (xhr.status === 200) {
                    switch (_default.dataType) {
                        case 'json':
                            result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                            break;
                        case 'xml':
                            result = xhr.responseXML;
                    }
                    _default.success && _default.success.call(xhr, result);
                }
            } else {
                _default.error && _default.error.call(xhr, xhr.status);
            }
        };
        if (/^post|put/i.test(_default.method)) {
            if (Object.prototype.toString.call(_default.data) === '[object Object]') {
                var data = JSON.stringify(_default.data);
                xhr.send(data)
            }
        } else {
            xhr.send(null)
        }
    }
    window.ajax = ajax;

})());