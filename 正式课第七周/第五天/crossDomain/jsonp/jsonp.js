/**
 * Created by zhufengpeixun on 2016/12/11.
 */
(function () {
    var ready = (function () {
        if (window.addEventListener) {
            return function (callback) {
                if (document.readyState !== 'loading') {
                    callback();
                } else {
                    window.addEventListener('DOMContentLoaded', function () {
                        callback();
                    }, false);
                }

            }
        }
        return function (callback) {
            if (document.readyState !== 'loading') {
                callback();
                return;
            }
            // document.readyState
            /**
             * loading 正在加载html
             * interactive html加载完毕，正加载其他资源
             * complete 所有资源加载完毕
             *
             * 在ie下 html资源特别少的情况下，interactive有一定几率不会出现，直接从loading变为complete。
             */
            document.onreadystatechange = function () {
                // 为了防止逻辑执行两遍
                if (document.readyState == 'interactive'
                    || document.readyState == 'complete') {
                    document.onreadystatechange = null;
                    callback();
                }
            }
        }
    }());

    /**
     * jsonp
     * @param {string} url jsonp接口地址
     * @param {*} data 往服务器发送的参数
     * @param {string} jsonpcallback 后端定义好的那个key
     * @param {Function} callback 回调函数
     */
    function jsonp(url, data, jsonpcallback, callback) {
        // 先定义全局函数名称
        var cbName = 'cb' + counter++;
        // 先定义全局函数
        window[cbName] = function (response) {
            try {
                callback(response);
            } finally {
                complete();
            }
        };
        url = appendToURI(url, jsonpcallback + '=' + cbName);
        data = param(data);
        data && (url = appendToURI(url, data));
        var script = document.createElement('script');
        script.src = url;
        ready(function () {
            document.body.appendChild(script);
        });
        function complete() {
            script.parentNode.removeChild(script);
            delete window[cbName];
        }
    }

    // 计数器
    var counter = 1;

    var toString = Object.prototype.toString;

    function param(data) {
        if (typeof data === 'string') {
            return data;
        }
        if (data === null || data === undefined) {
            return '';
        }
        if (toString.call(data) === '[object Object]') {
            var arr = [];
            for (var n in data) {
                if (!data.hasOwnProperty(n)) continue;
                arr.push(encodeURIComponent(n)
                    + '='
                    + encodeURIComponent(data[n]));
            }
            return arr.join('&');
        }
        return data.toString();
    }

    function appendToURI(url, padString) {
        var hasQuery = /\?/.test(url);
        return url + (hasQuery ? '&' : '?') + padString;
    }

    window.jsonp = jsonp;


}());