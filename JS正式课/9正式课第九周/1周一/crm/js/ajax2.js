((function () {
    function ajax(opt) {

        if (!tools.isType(opt,'Object')){
            throw new TypeError('参数不正确')
        }
        var xhr = tools.getXHR();
        //默认参数
        var url = opt.url||'/';
        var method = opt.method||'get';
        var async = !!(opt.async===undefined?true:opt.async);
        var data = opt.data||null;
        var isGet = /^get|delete|head$/gi.test(method);
        //先判断时候传参
        if (isGet && data){
            //先将data格式化为字符串
            data = tools.param(data);
            //将往服务器端传的参数拼接到url地址上
            url = tools.appendToURL(url,data);
            data=null;
        }
        //时候清除缓存
        if (isGet&& opt.catch===false){
            var rand = Math.random();
            url = tools.appendToURL(url,'_='+rand)
        }
        xhr.open(method,url,async);
        if (typeof opt.headers==='object'&&xhr.setRequestHeader){
            for (var key in opt.headers){
                if (!opt.headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key,opt.headers[key])
            }
        }
        xhr.onreadystatechange = function () {

            if (xhr.readyState===4){
                if (/^2\d{2}$/.test(xhr.status)||xhr.status===304){
                    var result = xhr.responseText;
                    if (opt.dataType==='json'){

                        try {
                            result = 'JSON' in window ?JSON.parse(result):eval('('+result+')');
                        }catch (e){
                            typeof opt.error=='function'&&opt.error.call(xhr,e);
                            return;
                        }
                        typeof opt.success=='function'&&opt.success.call(xhr,result)
                    }
                }else {
                    typeof opt.error=='function'&&opt.error.call(xhr,xhr.status)
                }
            }
        };

        if (/^post|put/i.test(method)){
            if (typeof data==='object'){
                xhr.send(JSON.stringify(data))
            }

        }else {
            xhr.send(data)
        }
    }

    var tools = {
      getXHR:(function () {
          var list = [
              function () {
                  return new XMLHttpRequest;
              },
              function () {
                  return new ActiveXObject('Microsoft.XMLHTTP');
              },
              function () {
                  return new XActiveXObject('Msxml2.XMLHTTP');
              },
              function () {
                  return new XActiveXObject('Msxml3.XMLHTTP');
              },
          ];
          var xhr = null;
          while (xhr=list.shift()){
              try{
                  xhr();
                  return xhr;
              }catch (e){
              }
          }
          throw new ReferenceError("该浏览器不支持ajax功能");
      })(),
        isType:function (data, type) {
            return Object.prototype.toString.call(data)==='[object '+type+']';
        },
        param:function (data) {
            if (this.isType(data,'String')){
                return data;
            }
            if (data===null || data===undefined){
                return '';
            }
            if (this.isType(data,'Object')){
                var ary = [];
                for (var key in data){
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key+'='+data[key])
                }
                return ary.join('&');
            }
            return String(data);
        },
        appendToURL:function (url, dataString) {
            var char = url.indexOf('?')===-1?'?':'&';
            return url+char+dataString;

        }



    };
    this.ajax = ajax;
})());
