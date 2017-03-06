(function () {
    function ajax(opt) {
        if (!tools.isType(opt,'Object')){
            throw new TypeError('参数不正确')
        }
        var xhr = tools.getXHR();
        var url = opt.url || '/';
        var type = opt.type || 'get';
        var async = !!(opt.async==='undefined'?true:opt.async);
        var data = opt.data || null;
        var isGet = /^get|delete|head$/gi.test(type);
        if (isGet && data){
            //把data进行格式化
            data=tools.paramData(data);
            url = tools.appendToURL(url,data);
            data=null;
        }
        if (isGet && opt.catch===false){
            var rand = Math.random();
            url = tools.appendToURL(url,'_='+rand);
        }
        xhr.open(type,type,async);
        if (xhr.setRequestHeader && tools.isType(opt.headers,'Object')){
            for (var key in opt.headers){
                if (!opt.headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key,opt.headers[key])
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState===4){
                if (/^2\d{2}$/g.test(xhr.status) ||xhr.status===304){
                    var result = xhr.responseText;
                    if (opt.dataType==='json'){
                        try {
                        result = 'JSON' in window ? JSON.parse(result):eval('('+result+')');
                        }catch (e){
                            typeof opt.error=='function'&&opt.error.call(xhr,e);
                            return;
                        }
                    }
                    typeof opt.success==='function'&&opt.success.call(xhr,result)
                }else {
                    typeof opt.error=='function'&&opt.error.call(xhr,xhr,status);
                }
            }
        };
        if (!isGet && data){
            if (isType(data,'Object')){
                xhr.send(JSON.stringify(data));
            }
        }else {
            xhr.send(null);
        }
    }
    var tools={
      getXHR:(function () {
          var list = [
              function () {
                  return new XMLHttpRequest();
              },
              function () {
                  return new ActiveXObject('Microsoft.XMLHTTP');
              },
              function () {
                  return new ActiveXObject('Msxml2.XMLHTTP');
              },
              function () {
                  return new new ActiveXObject('Msxml2.XMLHTTP');
              }
          ];
          var xhr = null;
          while (xhr=list.shift()){
              try{
                  xhr();
                  return xhr
              }catch (e){

              }
          }
          throw new ReferenceError('当前浏览器不支持ajax功能')
      })(),
        isType:function (data, dataType) {
            return Object.prototype.toString.call(data)==='[object '+dataType+']'
        },
        paramData:function (data) {
            if (this.isType(data,'String')){
                return data;
            }
            if (data==null ||data==undefined){
                return '';
            }
            if (this.isType(data,'Object')){
                var ary = [];
                for (var key in data){
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key+'='+data[key]);
                }
                return ary.join('&')
            }
            return String(data);
        },
        appendToURL:function (url, strData) {
            strData = this.paramData(strData);
            var char = url.indexOf('?')===-1?'?':'&';
            return url+char+strData;
        }
    };
    this.ajax=ajax;
})();
