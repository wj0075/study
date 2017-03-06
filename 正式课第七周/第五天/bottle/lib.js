/**
 * Created by zhufengpeixun on 2016/12/10.
 */
(function () {

    /**
     * ajax核心逻辑，把不变封装为一个函数，变的当成参数传进来
     * @param {Object} options 用法配置的参数
     */
    function ajax(options) {
        // 先判断用户传进来的参数是否为对象
        if (!tools.isType(options, 'Object')) {
            throw new TypeError('参数类型错误');
        }
        // step 1
        var xhr = tools.getXHR();

        // 默认方法
        var method = options.method || 'get';
        // 请求路径
        var url = options.url || '/';
        // 是否为异步
        var async = !!(options.async === undefined ? true : options.async);
        // 是否为get系方法
        var isGet = /^get|delete|head$/ig.test(method);

        // 把data格式化为请求参数的格式
        var data = tools.param(options.data);
        // get系方法，需要将data格式为请求参数的格式 拼接到url后面
        // get系方法，判断是否需要清缓存
        if (isGet && data) {
            url = tools.appendToURL(url, data);
            // 因为get系方法不需要给send方法传参数，所以这里提前将data设置为null
            data = null;
        }
        if (isGet && options.cache === false) {
            // 在url后加随机数
            var rand = Math.random();
            // 因为不能覆盖用户原有的参数，而没有人用_当key
            url = tools.appendToURL(url, '_=' + rand);
        }

        // step 2
        xhr.open(method, url, async, options.username, options.password);

        // 自定义请求头
        if (xhr.setRequestHeader && tools.isType(options.headers, 'Object')) {
            for (var header in options.headers) {
                if (!options.headers.hasOwnProperty(header)) continue;
                xhr.setRequestHeader(header, options.headers[header]);
            }

        }

        // step 3
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var responseText = xhr.responseText;
                if (/^2\d{2}/.test(xhr.status) || xhr.status === 304) {
                    // 先通过dataType格式化一下
                    if (options.dataType === 'json') {
                        // 未来解决服务器返回的数据有可能不是一个合法的JSON字符串，所以parse的时候报错也可以继续执行。所以应该加上try catch
                        try {
                            responseText = tools.JSONParse(responseText);
                        } catch (ex) {
                            typeof options.error === 'function'
                            && options.error(ex);
                            return;
                        }
                    }
                    typeof options.success === 'function'
                    && options.success(responseText);
                } else {
                    typeof options.error === 'function'
                    && options.error(xhr.status);
                }
            }
        };

        // step 4
        xhr.send(data);

        return xhr;
    }

    var tools = {
        getXHR: (function () {
            var list = [
                function () {
                    return new XMLHttpRequest();
                }, function () {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }, function () {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                }, function () {
                    return new ActiveXObject('Msxml3.XMLHTTP');
                }];

            var xhr = null;
            while (xhr = list.shift()) {
                try {
                    xhr();
                    return xhr;
                } catch (ex) {

                }
            }
            throw new ReferenceError('当前浏览器不支持ajax功能');
        })(),
        /**
         * 判断数据类型
         * @param {*} data 待判断的数据
         * @param {string} type 类型
         */
        isType: function (data, type) {
            return Object.prototype.toString.call(data) === '[object ' + type + ']';

        },
        /**
         * 将data格式化为请求参数的格式
         * @param data
         */
        param: function (data) {
            // 判断data是否为字符串
            if (tools.isType(data, 'String')) {
                return data;
            }
            // 如果data为null或者undefined
            if (data === null || data === undefined) {
                return '';
            }
            // 如果data为对象
            // {a:1,b:2}
            if (this.isType(data, 'Object')) {
                var arr = [];
                for (var name in data) {
                    if (!data.hasOwnProperty(name)) continue;
                    // 因为URL中不能存在非英文字符，所以需要格式化为URIString格式
                    arr.push(encodeURIComponent(name)
                        + '='
                        + encodeURIComponent(data[name]));
                }
                // ['a=1','b=2'] 使用 & 来join
                return arr.join('&');
            }
            return String(data);
        },
        /**
         * 把参数拼接到url后面
         * @param url
         * @param padStirng
         */
        appendToURL: function (url, padStirng) {
            // 先将用户传过来的参数格式化一下
            padStirng = tools.param(padStirng);
            // 判断url中是否含有？，如有？说明URL中已存在请求参数，
            // 否则，不存请求参数
            var hasQuery = /\?/.test(url);
            // 有问号，再往后拼接参数，应该使用&
            // a.com?a=1&b=2
            // a.com?c=3
            return url + (hasQuery ? '&' : '?') + padStirng;
        },
        JSONParse: function (jsonString) {
            if (window.JSON) {
                return JSON.parse(jsonString)
            }
            return eval('(' + jsonString + ')');
        }
    };

    this.ajax = ajax;
}());