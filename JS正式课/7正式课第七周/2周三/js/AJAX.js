function AJAX(opt) {
    var _default = {
        //1.请求方式
        type: 'get',
        //2.请求地址
        url: null,
        //3.同步异步
        async: true,
        //4.是否清理缓存 不想走缓存false
        cache: false,//
        //5.请求成功后需要做的事情
        success: null,
        error: null,
        //6.请求失败后做的事情
        //7.当用post的时候，向服务器传递的参数类型
        data: null, //post请求下在请求主体中传入的内容
        //8.服务器返回的文件类型 txt  xml  json
        dataType: 'txt'
    };
    for (var key in opt) {
        _default[key] = opt[key];
    }

    var xml = new XMLHttpRequest();
    if (_default.cache == true) {

        var o = null;
        if (_default.url.indexOf('?') === -1) {
            o = '?'
        } else {
            o = '&'
        }
        _default.url += '' + o + '_=' + Math.random();
    }
    xml.open(_default.type, _default.url, _default.async);//此处三个参数
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && xml.status === 200) {
            var result = xml.responseText;
            switch (result) {
                case 'xml':
                    result = xml.responseXML;
                    break;
                case 'json':
                    result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
            }
            typeof _default.success == 'function' ? _default.success.call(xml, result) : null;
        } else {
            typeof _default.error == 'function' ? _default.error.call(xml, xml.responseText) : null;
        }
    };
    xml.send(_default.data);
}
