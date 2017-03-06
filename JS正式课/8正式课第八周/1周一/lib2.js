((function () {
    function ajax(opt) {
        //先判断传进来的参数是不是一个对象
        if (!tools.isType(opt, 'Object')) {
            return new TypeError('参数格式不正确')
        }
        //第一步 创建ajax对象
        var xhr = tools.getXHR();
        //默认参数
        var url = opt.url || '/';
        var method = opt.method || 'get';
        var async = !!(opt.async === undefined ? true : opt.async);
        //格式化为请求参数
        var data = tools.param(opt.data);
        //先判断以下是不是get系方法，因为它关系着往服务器传参和是否清理缓存
        var isGet = /^get|head|delete$/ig.test(method);
        if (isGet && data) {
            url = tools.appendToURL(url, data);
            //提前将data清空，因为在get系中用不到了就
            data = null;
        }
        //如果要清理缓存
        if (isGet && opt.catch === false) {
            var rand = Math.random();
            url = tools.appendToURL(url, '_=' + rand)
        }
        xhr.open(method, url, async);
        //如果要自定义请求头，要放在open后面
        if (xhr.setRequestHeader && tools.isType(opt.headers, 'Object')) {
            for (var header in opt.headers) {
                if (!opt.headers.hasOwnProperty(header)) continue;
                xhr.setRequestHeader(header, opt.headers[header])
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var result = xhr.responseText;
                if (xhr.status === 304 || /^2\d{2}/.test(xhr.status)) {
                    if (opt.dataType === 'json') {
                        //为了防止服务器发送的不是JSON格式的数据，就算报错也不影响后面的代码执行。
                        try {
                            result = tools.JSONParse(result)
                        } catch (e) {
                            typeof opt.error === 'function' && opt.error(e);
                            return
                        }
                    }
                    typeof opt.success === 'function' && opt.success(result);
                } else {
                    typeof opt.error === 'function' && opt.error(xhr.status);
                    return;
                }
            }
        };
        xhr.send(data);
    }

    var tools = {
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']'
        },
        getXHR: (function () {
            var list = [
                function () {
                    return new XMLHttpRequest;
                },
                function () {
                    return new ActiveXObject('Microsoft.XMLHTTP')
                },
                function () {
                    return new ActiveXObject('Msxml2.XMLHTTP')
                }, function () {
                    return new ActiveXObject('Msxml2.XMLHTTP')
                }
            ];

            var xhr = null;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    return xhr;
                } catch (e) {

                }
            }
            throw new ReferenceError('浏览器不支持ajax功能')
        }()),
        param: function (data) {
            //如果传进来的是字符串
            if (tools.isType(data, 'String')) {
                return data;
            }
            //如果传进来的时候null和undefined
            if (data === null || data === undefined) {
                return '';
            }
            //如果传进来的是对象
            if (tools.isType(data, 'Object')) {
                var ary = [];
                for (var key in data) {
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key + '=' + data[key])
                }
                return ary.join('&')
            }
            //如果是其他的类型直接转换成字符串。
            return String(data)
        },
        appendToURL: function (url, padString) {
            //先判断url中有没有？号
            var hasQuery = /\?/g.test(url);
            return url + (hasQuery ? '&' : '?') + padString
        },
        JSONParse: function (jsonString) {
            return 'JSON' in window ? JSON.parse(jsonString) : eval('(' + jsonString + ')')
        }
    };
    window.ajax = ajax;
})());
