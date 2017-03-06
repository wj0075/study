var utils = {
    /**
     * makeArray 功能：类数组转数组方法封装
     * @param arg  传进的参数（一个类数组）
     * @returns {Array} 返回一个数组
     */
    makeArray:function makeArray(arg){
        var ary = [];
        try{
            ary = Array.prototype.slice.call(arg);
        }catch(e){
            for(var i = 0;i < arg.length;i++){
                ary.push(arg[i]);
            }
        }
        return ary
    },
    /**
     * jsonParse 功能：把JSON格式的字符串，转成JSON格式的数据（对象）
     * @param str 传入的JSON格式的字符串
     * @returns {Object}  转换好的JSON格式的对象
     */
    jsonParse:function jsonParse(str){
        return 'JSON' in window ? JSON.parse(str):eval('('+str+')');
    },
    /**
     * rand  功能：获取一定范围的随机数
     * @param n
     * @param m
     * @returns {number}
     */
    rnd:function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();//当返回0-1之间的随机小数，就代表传参传错了；
        }
        if(n>m){
            var tmp=n;
            n=m;
            m=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    },
    /**
     * hasPubProperty 功能：判断是否为公有属性
     * @param attr  属性
     * @param obj   属性所在对象
     * @returns {boolean} 返回是否
     */
    hasPubProperty:function hasPubProperty(attr,obj){
        return 'attr' in obj && !obj.hasOwnProperty(attr);
    },
    /**
     * win 功能：盒子模型兼容处理
     * @param attr
     * @param value  给元素设置的值
     * @returns {*} 返回的是属性的值
     */
    win:function win(attr,value){
        if (value === undefined){
            return document.documentElement[attr]||document.body[attr];
        }else {
            document.documentElement[attr]=document.body[attr]=value;
        }
    },
    /**
     * offset 功能：  求盒子模型的偏移量；当前元素到body的距离。
     * @param curEle  当前元素
     * @returns {{left: (Number|number), top: (Number|number)}}  距离左body的距离  距离上body的距离
     */
    offset:function offset(curEle){
        var par = curEle.offsetParent;
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        while (par){
            if(window.navigator.userAgent.indexOf('MSIE 8')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par = par.offsetParent;
        }
        return {left:l,top:t};
    },
    /**
     * getByClass 功能：通过class类名，获取一组元素
     * @param str  传入类名
     * @param parent  所属的父元素
     * @returns {*}  返回一组元素；
     */
    getByClass:function getByClass(str,parent){
        var parent = parent||document;
        var ary = [];
        if ('getComputedStyle' in window){
            return this.makeArray(parent.getElementsByClassName(str));
        }else {
            var aryClass = str.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            var nodeList = parent.getElementsByTagName('*');
            for (var i=0;i<nodeList.length;i++){
                var cur = nodeList[i];
                var bOk = true;
                for(var j=0;j<aryClass.length;j++){
                    var reg = new RegExp('(^| +)'+aryClass[j]+'( +|$)','g');
                    if (!reg.test(cur.className)){
                        bOk = false;
                        break;
                    }
                };
                if (bOk){
                    ary.push(cur);
                }
            }
        }
        return ary;
    },
    /**
     * hasClass 功能：判断类名是否在元素身上；
     * @param curEle
     * @param cName
     * @returns {boolean}
     */
    hasClass:function hasClass(curEle,cName){
        var reg = new RegExp('(^| +)'+cName+'( +|$)','g');
        return reg.test(curEle.className);
    },
    /**
     * addClass  功能：给元素增加类名；
     * @param curEle
     * @param strClass
     */
    addClass:function addClass(curEle,strClass){
        var aryClass = strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for (var i=0;i<aryClass.length;i++){
            if(!this.hasClass(curEle,aryClass[i])){
                curEle.className+= ' '+aryClass[i];
            }
        }
        curEle.className = curEle.className.replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
    },
    /**
     * removeClass  功能：移除元素身上的某些类名
     * @param curEle
     * @param strClass
     */
    removeClass:function removeClass(curEle,strClass){
        var aryClass = strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for (var i=0;i<aryClass.length;i++){
            var reg = new RegExp('(^| +)'+aryClass[i]+'( +|$)','g');
            if (reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,'').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
            }
        }
    },
    /**
     * getCss 功能：获取非行间样式：
     * @param curEle  元素
     * @param attr   属性
     * @returns {*}  样式值
     */
    getCss:function getCss(curEle,attr){
        var val = null;
        var reg = null;
        if ('getComputedStyle' in window){
            val = getComputedStyle(curEle,null)[attr];
        }else {
            if (attr === 'opacity') {
                val = curEle.currentStyle['filter'];
                reg = /^alpha\(opacity[=:](\d+(\.\d+)?)\)$/gi;
                return reg.test(val) ? RegExp.$1 / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        }
        reg = /^(left|right|top|bottom|width|height|((margin|padding)(left|right|top|bottom)?))$/gi;
        return reg.test(attr)?parseFloat(val):val;
    },
    /**
     * setCss  功能：给某个元素添加css样式。只能给元素添加一个css样式
     * @param curEle
     * @param attr
     * @param value
     */
    setCss:function setCss(curEle,attr,value){
        if (attr === 'float'){
            curEle.style.styleFloat=value;
            curEle.style.cssFloat = value;
            return;
        }
        if(attr==='opacity'){
            curEle.style[attr]=value;
            curEle.style['filter']='alpha(opacity='+value+')';
            return;
        }
        //对单位的处理
        var reg = /^([+-])?(\d+(\.\d+)?)(px|pt|rem|em|%)?$/gi;
        if (reg.test(value)){
            if (!isNaN(value)){
                value = value+'px';
            }
        }
        curEle.style[attr]=value;
    },
    /**
     * setGroupCss  功能：给元素添加一组样式
     * @param curEle
     * @param opt
     */
    setGroupCss:function setGroupCss(curEle,opt){
        if (Object.prototype.toString.call(opt)==='[object Object]'){
            for(var key in opt){
                this.setCss(curEle,key,opt[key])
            }
        }
    },
    /**
     * css  功能：综合性根据参数的不同，行使不同的功能。
     * @param curEle
     * @returns {*}
     */
    css:function(curEle){
        var argTwo = arguments[1];
        if (typeof argTwo==='string'){
            var argThree = arguments[2];
            if (argThree===undefined){
                    return this.getCss(curEle,argTwo);
            }else {
                this.setCss(curEle,argTwo,argThree);
            }
        }
        if (Object.prototype.toString.call(argTwo)==='[object Object]'){
            this.setGroupCss(curEle,argTwo);
        }
    },
    /**
     * getChildren 功能：获取子元素节点,当设置第二个参数的时候，获取设置的标签
     * @param curEle  父级元素
     * @returns {Array}  返回一个数组，包含所有的子级元素节点
     */
    getChildren:function getChildren(curEle,tagName){
        var nodeList = curEle.childNodes;
        var ary = [];
        for (var i=0;i<nodeList.length;i++){
            var cur = nodeList[i];
            if(cur.nodeType===1){
                if(tagName){
                    if (cur.tagName.toLowerCase()===tagName.toLowerCase()){
                        ary.push(cur);
                    }
                }else {
                    ary.push(cur)
                }
            }
        }
        return ary;
    },
    /**
     * prev  功能：获取上一个哥哥元素
     * @param cueEle
     * @returns {*}
     */
    prev:function prev(curEle){
        if ('getComputedStyle' in window){
            return curEle.previousElementSibling;
        }
        var  pre = curEle.previousSibling;
        while (pre && pre.nodeType!==1){
            pre = pre.previousSibling;
        }
        return pre;
    },
    /**
     * next 功能：获取下一个弟弟元素
     * @param curEle
     * @returns {*}
     */
    next:function next(curEle){
        if ('getComputedStyle' in window){
            return curEle.nextElementSibling;
        }
        var  nex = curEle.nextSibling;
        while (nex && pre.nodeType!==1){
            nex = nex.nextSibling;
        }
        return nex;
    },
    /**
     * sibling  功能：获取相邻元素
     * @param curEle
     * @returns {Array}
     */
    sibling:function sibling(curEle){
        var ary = [];
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    },
    /**
     * prevAll  功能：获取所有的哥哥元素
     * @param curEle
     * @returns {Array}
     */
    prevAll:function prevAll(curEle){
        var pre = this.prev(curEle);
        var ary = [];
        while (pre){
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    },
    /**
     * next  功能：获取所有的弟弟元素
     * @param curEle
     * @returns {Array}
     */
    nextAll:function nextAll(curEle){
        var nex = this.next(curEle);
        var ary = [];
        while (nex){
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    },
    /**
     * siblings  功能：获取所有的相邻元素
     * @param curEle
     * @returns {Array.<T>}
     */
    siblings:function siblings(curEle){
        var prevs = this.prevAll(curEle);
        var nexs = this.nextAll(curEle);
        return prevs.concat(nexs);
    },
    /**
     * firstChild  功能：获取第一个子级元素
     * @param curEle
     * @returns {*}
     */
    firstChild:function firstChild(curEle){
        var children = this.getChildren(curEle);
        return children[0];
    },
    /**
     * lastChild  功能：获取最后一个子级元素；
     * @param curEle
     * @returns {*}
     */
    lastChild:function lastChild(curEle){
        var children = this.getChildren(curEle);
        return children[children.length-1];
    },
    /**
     * index  功能：获取当前元素的索引位置
     * @param curEle
     * @returns {Number}
     */
    index:function index(curEle){
        return this.prevAll(curEle).length
    },
    /**
     * prependChild  功能：向容器开头添加元素
     * @param curEle
     * @param parent
     */
    prependChild:function prependChild(curEle,parent){
        var first = this.firstChild(parent);
        if (first){
            parent.insertBefore(curEle,first);
        }else {
            parent.appendChild(curEle);
        }
    },
    /**
     * insertAfter  功能：向元素的后面添加元素
     * @param curEle
     * @param oldEle
     */
    insertAfter:function insertAfter(curEle,oldEle){
        var nex = this.next(curEle);
        if(nex){
            oldEle.parentNode.insertBefore(curEle,nex);
        }else {
            oldEle.parent.appendChild(curEle)
        }
    }



};

