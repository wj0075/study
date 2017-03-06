function ajax(opt) {
    var _default = {
        url: null,
        type: 'get',
        async: true,
        dataType: 'json',
        success: null,
        error: null,
        data: null
    };
    for (var key in opt) {
        if (opt.hasOwnProperty(key)) {
            _default[key] = opt[key];
        }
    }
    var xhr = new XMLHttpRequest;
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var result = xhr.responseText;
                result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                _default.success && _default.success.call(xhr, result);
            }
            return;
        }
        _default.error && _default.error.call(xhr, xhr.responseText);
    };
    xhr.send(_default.data);
}
