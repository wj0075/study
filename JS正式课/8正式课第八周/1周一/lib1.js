/**
 * Created by wj007 on 2016/12/12.
 */
((function(){
    /**
     * ajax核心逻辑，把不变封装为一个函数，变的当成参数传进来
     * @param opt
     */
    function ajax(opt){
        //先判断用户传进来的参数是否为对象
        if (!tools.isType(opt,'Object')){
            throw new TypeError('参数类型错误')
        }
        //开始进行第一步 创建一个ajax对象，因为ajax对象存在兼容问题，所以在定义一个函数来解决兼容问题。
        var xhr = tools.getXHR();
        //开始为后面的参数准备默认值
        //默认的请求方式
        var method = opt.method||'get';
        //请求路径
        var url = opt.url||'/';
        //是否为异步(这里考虑到用户传进来的可能是false，所以就不能用或运算了，要用三元运算符好一下.当用户什么都不传的时候，默认是true异步。否则就是同步。但是有可能传的既不是true也不是false,却是别的数据类型，所以我们就把他们传的的任何数据类型都强制转换成布尔的类型)
        var async = !!(opt.async===undefined?true:opt.async);
        //判断是不是get系的方法,因为get系方法和post系方法影响着向服务器传参用那种方式。并且还影响着是否需要清理缓存。所以要判断出来。
        var isGet = /^get|delete|head$/ig.test(method);
        //把data格式化为请求参数的格式，为什么要格式化data的请求参数，因为你传进来的参数各式各样的，需要把它们转换成统一的类型，以供ajax使用,统一转换成字符串类型的。
        var data = tools.param(opt.data);
        //get系方法，需要将data格式化为请求参数的格式拼接到url后面。
        //如果是get系的请求，并且需要往服务器传送参数，这时候只能使用问号传参的方式，因为get系没有请求主体。所以要将传进来的参数拼接到url后面。这时在需要一个函数来完成这个功能。
        if (isGet && data){
            url = tools.appendToURL(url,data);
            //因为get系方法不需要给send方法传参数，只要走了这一步证明就是get系方法了，所以可以地前将data设置为null;
            data = null;
        }
        //只有get系的方法才会清理缓存的，post系根本就不会使用缓存。
        if (isGet && opt.cache===false){
            //在url后面加上随机数就不会有缓存了
            var rand = Math.random();
            url = tools.appendToURL(url,'_='+rand)
        }
        //第二步
        xhr.open(method,url,async);
        //自定义请求头：只能放在open后面。
        if (xhr.setRequestHeader && tools.isType(opt.header,'Object')){
            for (var header in opt.header){
                if (!opt.header.hasOwnProperty(header)) continue;
                xhr.setRequestHeader(header,opt.header[header])
            }
        }

        //第三步
        xhr.onreadystatechange = function(){
            if (xhr.readyState===4){
                var responseText = xhr.responseText;
                if (/^2\d{2}/.test(xhr.status) || xhr.status===304){
                    //根据请求的dataType预先要求的数据格式。在这里进行格式化。
                    if (opt.dataType==='json'){
                        //来解决服务器返回的数据有可能不是一个合法的JSON字符串，所以parse的时候报错也可以继续执行，所以应该加上try catch
                        try {
                            responseText = tools.JSONParse(responseText)
                        }catch (e){
                            typeof opt.error==='function'&&opt.error(e);
                            return;
                        }
                    }
                    typeof opt.success ==='function'&&opt.success(responseText);
                }else {
                    typeof  opt.error==='function'&&opt.error(xhr.status);
                }

            }

        };
        //第四步
        xhr.send(data);
        return xhr;
    }





    var tools ={
        /**
         * 判断数据类型
         * @param data  待判断的数据
         * @param type {string} 类型
         */
        isType:function(data,type){
            return Object.prototype.toString.call(data)==='[object '+type+']'
        },
        /**
         * 获取xhr对象
         */
        getXHR:(function(){
            var list = [
                function(){
                   return new XMLHttpRequest;
                },
                function(){
                    return new ActiveXObject('Microsoft.XMLHTTP')
                },
                function(){
                    return new ActiveXObject('Msxml2.XMLHTTP')
                },
                function(){
                    return new ActiveXObject('Msxml3.XMLHTTP')
                }
            ];
            var xhr = null;
            while (list.length){
                xhr = list.shift();
                try {
                    xhr();
                    return xhr
                }catch (e){

                }
            }
            throw new ReferenceError('当前浏览器不支持AJAX功能')
        })(),
        /**
         * 将data格式化为请求参数的格式
         * @param data
         */
        param:function(data){
            //判断data是否为字符串,这就运用到了前面所写的判断数据类型的函数
            if(tools.isType(data,'String')){
                return data
            }
            //如果data为null或者undefined,jiu 转换成空字符串
            if(data===null||data===undefined){
                return '';
            }
            //如果data为对象
            //{a:1,b:2}
            if (this.isType(data,'Object')){
                //如何将对象转换为字符串
                var ary = [];
                for (var key in data){
                    //防止for in 循环原型上的方法。
                    if (!data.hasOwnProperty(key)) continue;
                    ary.push(key+'='+data[key]);
                }
                //['a=1','b=2']使用 &来join
                return ary.join('&');
            }
            return String(data)
        },
        /**
         * 把参数拼接到url后面
         * @param url
         * @param padString
         */
        appendToURL:function(url,padString){
            //先将用户传进来的参数格式化以下
            padString = tools.param(padString);
            //判断url中是否含有？，如果有？说明url中已存在请求参数，否则，就不存在请求参数
            var hasQuery = /\?/.test(url);
            //有问号，再往后拼接参数，应该使用&
            //a.con?a=1&b=2
            //a.com?c=3
            return url+(hasQuery?'&':'?')+padString;
        },
        JSONParse:function(jsonString){
            return  'JSON' in window ?JSON.parse(jsonString):eval('('+jsonString+')')
        }
    }
    window.ajax=ajax;
})());