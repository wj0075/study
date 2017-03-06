function ajax(opt) {
    var _default = {
        //1.url
        url: '',
        //2.请求方式
        type: 'get',
        //3.同步异步
        async: true,
        //4.是否清理缓存
        cache: false,
        //5.返回什么类型的请求主体
        dataType: 'text',
        //6.send传的类型
        data: null,
        //7.成功之后做什么
        success: null,
        //8.失败之后做什么
        error: null
    };
    for (var key in opt) {
        _default[key] = opt[key];
    }
    if (_default.cache == true) {
        var o = null;
        if (_default.url.indexOf('?') !== -1) {
            o = '&';
        } else {
            o = '?'
        }
        _default.url += o + '_=' + Math.random();
    }
    var xml = new XMLHttpRequest();
    xml.open(_default.type, _default.url, _default.async);
    xml.onreadystatechange = function () {
        if (xml.status === 200) {
            if (xml.readyState == 4) {
                var result = xml.responseText;
                switch (_default.dataType) {
                    case 'xml':
                        result = xml.responseXML;
                        break;
                    case 'json':
                        result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                        break;
                }
                _default.success && _default.success.call(xml, result);
            }
            return;
        }
        _default.error && _default.error.call(xml, xml.responseText);
    };
    xml.send(_default.data);
}
