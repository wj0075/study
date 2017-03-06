function ajax(options) {
    var _default = {
        url: null,
        type: 'get',
        async: true,
        cache: true,//->不想走缓存传递false
        dataType: 'text',//->预设获取的数据内容是什么格式的 text:字符串 xml:XML数据 json:JSON格式的对象
        data: null,//->POST请求下在请求主体中传入的内容
        success: null,
        error: null
    };
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            _default[key] = options[key];
        }
    }

    //->SEND AJAX
    var xhr = new XMLHttpRequest;
    if (_default.cache === false) {
        var char = _default.url.indexOf('?') === -1 ? '?' : '&';
        _default.url += char + '_=' + Math.random();
    }
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200) {
            if (xhr.readyState === 4) {
                var result = xhr.responseText;
                switch (_default.dataType) {
                    case 'xml':
                        result = xhr.responseXML;
                        break;
                    case 'json':
                        result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                        break;
                }
                _default.success && _default.success.call(xhr, result);
            }
            return;
        }
        //->失败
        //typeof _default.error === 'function' ? _default.error.call(xhr, xhr.responseText) : null;
        _default.error && _default.error.call(xhr, xhr.responseText);
    };
    xhr.send(_default.data);
}

//ajax({
//    error: function (msg) {
//        //this->xhr
//        //msg->error message
//    }
//});