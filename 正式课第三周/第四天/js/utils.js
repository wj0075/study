/**
 * Created by 39753 on 2016/11/9.
 */
var utils=(function() {
    var flag='getComputedStyle' in window;
    return {
        //makeArray:类数组转数组
        makeArray: function (arg) {
            var ary = [];
            if (flag) {//标准浏览器
                ary = Array.prototype.slice.call(arg);
            } else {//IE浏览器；
                for (var i = 0; i < arg.length; i++) {
                    ary.push(arg[i]);
                }
            }
            return ary;
        },
        //jsonParse:JSON格式的字符串转成JSON格式的数据（对象）
        jsonParse: function (jsonStr) {
            return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
        },
        //win:JS盒子模型兼容处理；
        win: function (attr, value) {
            if (value === undefined) {
                return document.documentElement[attr] || document.body[attr];
            }
            document.documentElement[attr] = document.body[attr] = value;
        },
        //offset:求盒子模型的偏移量； 当前元素到body的距离；
        offset: function (curEle) {
            var par = curEle.offsetParent;
            var l = curEle.offsetLeft;
            var t = curEle.offsetTop;
            while (par) {
                if (window.navigator.userAgent.indexOf('MSIE 8') == -1) {
                    l += par.clientLeft;
                    t += par.clientTop;
                }
                l += par.offsetLeft;
                t += par.offsetTop;
                par = par.offsetParent;
            }
            return {left: l, top: t};
        },
        //rnd:求一定范围的随机数
        rnd: function (n, m) {
            n = Number(n);
            m = Number(m);
            if (isNaN(n) || isNaN(m)) {
                return Math.random();//当返回0-1之间的随机小数，就代表传参传错了；
            }
            if (n > m) {
                var tmp = n;
                n = m;
                m = tmp;
            }
            return Math.round(Math.random() * (m - n) + n);
        },
        //getByClass:通过class名（可以限定范围的）获取元素；
        getByClass:function(strClass,parent){
            parent=parent||document;
            if(flag){
                return this.makeArray(parent.getElementsByClassName(strClass));
            }
            //IE浏览器的兼容处理：
            //1.把字符串转成数组
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            //2.拿到该容器下所有的子元素
            var nodeList=parent.getElementsByTagName('*');
            var ary=[];
            //3.校验每个元素的className,看他是否包含数组中的每一项；
            for(var i=0; i<nodeList.length; i++){
                var cur=nodeList[i];
                var bOk=true;//先假设元素身上包含数组中的每个class名；
                for(var j=0; j<aryClass.length; j++){
                    var reg=new RegExp('(^|\\s+)'+aryClass[j]+'(\\s+|$)','g');
                    if(!reg.test(cur.className)){
                        bOk=false;
                        break;
                    }
                }
                if(bOk){
                    ary.push(cur);
                }
            };
            return ary;
        },
        //hasClass:判断元素身上是否有某个class名；
        hasClass:function(curEle,cName){
            var reg=new RegExp('(^| +)'+cName+'( +|$)','g');
            return reg.test(curEle.className);
        },
        //addClass:可以给元素身上以字符串的形式批量添加class名（当元素身上每个这个class名的时候，可以给元素添加这个class名）;
        addClass:function(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0; i<aryClass.length; i++){
                if(!this.hasClass(curEle,aryClass[i])){
                    curEle.className+=' '+aryClass[i];
                    curEle.className=curEle.className.replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ')
                }
            }
        },
        //removeClass:移除元素身上某些class名； strClass;删除多个；'     box1     box2 box3     '
        removeClass:function(curEle,strClass){
            var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0; i<aryClass.length; i++){
                var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)','g');
                if(reg.test(curEle.className)){
                    curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
                }
            }
        },
        //getCss:获取非行间样式；
        getCss: function (curEle, attr) {
            var val = null;
            var reg = null;
            if (flag) {
                val = getComputedStyle(curEle, false)[attr];
            } else {
                if (attr === 'opacity') {
                    val = curEle.currentStyle['filter'];//alpha(opacity=10);
                    reg = /^alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi;
                    return reg.test(val) ? RegExp.$1 / 100 : 1;
                }
                val = curEle.currentStyle[attr];
            }
            reg = /(left|top|right|bottom|width|height|((margin|padding)(left|top|right|bottom)?))/gi;
            return reg.test(attr) ? parseFloat(val) : val;
        },
        //setCss:给元素身上设置一个样式；设置样式只能设置行内样式；
        setCss:function(curEle,attr,value){
            //3.对浮动的处理
            if(attr=='float'){
                curEle.style.cssFloat=value;//firefox,chrome,safari
                curEle.style.styleFloat=value;//IE
                return;
            }
            //2.对透明度的处理
            if(attr==='opacity'){
                curEle.style.opacity=value;
                curEle.style.filter='alpha(opacity='+value*100+')';
                return;
            }
            //1.对单位的处理
            var reg=/^([+-])?(\d+(\.\d+)?)(px|pt|rem|em|%)?$/;
            if(reg.test(value)){
                //当用户没有传单位的时候，默认按照PC端的样式设置；
                if(Number(value) || Number(value)==0){
                    value=value+'px';
                }
            }
            curEle.style[attr]=value;
        },
        //setGroupCss:给当前元素设置一组样式；
        setGroupCss:function(curEle,opt){
            if(Object.prototype.toString.call(opt) !== '[object Object]') return;
            for(var attr in opt){
                this.setCss(curEle,attr,opt[attr])
            }
        },
        //css:集获取，设置一个，设置一组样式为一体；
        css:function(curEle){
            var argTwo=arguments[1];
            if(typeof argTwo==='string'){
                var argThree=arguments[2];
                if(typeof argThree==='undefined'){//获取
                    return this.getCss(curEle,argTwo);
                }else{
                    this.setCss(curEle,argTwo,argThree);//设置一个样式；
                }
            }
            /*if(argTwo instanceof Object){ //[] instanceof Object
                this.setGroupCss(curEle,argTwo);
            }*/
            if(Object.prototype.toString.call(argTwo)==='[object Object]'){
                this.setGroupCss(curEle,argTwo);
            }
        }
        /*下手点：从参数来下手；css(curEle)
        * 1.如果第二个参数是字符串的话：1）有第三个参数-》设置一个 2）没有第三个参数-》代表获取（有返回值return）
        * 2.如果第二个参数是对象的话：设置一组；
        * */
    }
})();