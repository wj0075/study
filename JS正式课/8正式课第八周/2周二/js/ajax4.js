((function(){
    function ajax(opt){
        //判断opt
        if (!tools.isType(opt,'Object')){
            throw new TypeError('传递的参数不正确');
        }
        var xhr = tools.getXHR();
        var url=opt.url||'/',
            method=opt.method||'get',
            async = !!(opt.async===undefined?true:opt.async),
            data = opt.data;

        var isGet = /get|delete|head/i.test(method);
        if (isGet && data){
            //将data格式为请求参数的格式
            data = tools.param(data);
            //将url与传递的参数连接起来
            url = tools.appendToURL(url,data)
            data = null;
        }
        if (isGet &&opt.catch===false){
            var rand = Math.random();
            url=tools.appendToURL(url,'_='+rand)
        }
        xhr.open(method,url,async);
        if (typeof opt.headers==='object'){
            for (var key in opt.headers){
                if (!opt.headers.hasOwnProperty(key)) continue;
                xhr.setRequestHeader(key,opt.header[key])
            }
        }
        xhr.onreadystatechange=function(){
            if (xhr.readyState===4){
                if (/^2\d{2}/.test(xhr.status)||xhr.status===304){
                    var result = xhr.responseText;
                    if (opt.dataType==='json'){
                        result = 'JSON' in window?JSON.parse(result):eval('('+result+')')
                        try {
                            opt.success && opt.success.call(xhr,result)
                        }catch (e){
                            opt.error && opt.error.call(xhr,e)
                        }
                        return;
                    }
                    opt.success && opt.success.call(xhr,result)
                }else {
                    opt.error && opt.error.call(xhr,xhr.status)
                }
            }
        };
        if (!isGet){
            if (tools.isType(data,'Object')){
                xhr.send(JSON.stringify(data))
            }
        }else {
            xhr.send(null);
        }
    }
    var tools = {
      getXHR:((function(){
          var list = [
              function(){
                  return new XMLHttpRequest;
              },
              function() {
                  return new ActiveXObject('Microsoft.XMLHTTP');
              },
              function(){
                  return new ActiveXObject('Msxml2.XMLHTTP');
              },
              function(){
                  return new ActiveXObject('Msxml3.XMLHTTP');
              }
          ];
          var xhr = null;
          while (xhr=list.shift()){
              try {
                  xhr();
                  return xhr
              }catch (e){
              }
          }
          throw new ReferenceError('该浏览器不支持ajax功能')

      })()),
        isType:function(data,type){
            return Object.prototype.toString.call(data)==='[object '+type+']';
        },
        param:function(data){
            //data为字符串
            if(tools.isType(data,'String')){
                return data;
            }
            //null undefined
            if (data===null||data===undefined){
                return '';
            }
            //data 对象
            if (tools.isType(data,'Object')){
                var ary=[];
                for (var key in data){
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key+'='+data[key])
                }
                return ary.join('&')
            }
            return String(data)
        },
        appendToURL:function(url,padString){
            var char = /\?/.test(url);
            return url=url+(char?'&':'?')+padString
        }

    };


    this.ajax = ajax;
})());