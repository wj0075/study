/**
 * Created by 39753 on 2016/11/17.
 */
//1.获取数据 2.绑定数据 3.延迟加载+第一张图片显示出来，并且层级提高 4.自动渐隐渐现 5.焦点自动轮播 6.鼠标移入停止移出继续 7.点击焦点手动切换 8.点击左右按钮进行切换
(function () {
    var oBox = document.getElementById('box');
    var oBoxInner = oBox.getElementsByTagName('div')[0];
    var aDiv = oBoxInner.getElementsByTagName('div');
    var oUl = oBox.getElementsByTagName('ul')[0];
    var aLi = oBox.getElementsByTagName('li');
    var aImg = oBox.getElementsByTagName('img');
    var oBtnLeft = oBox.getElementsByTagName('a')[0];
    var oBtnRight = oBox.getElementsByTagName('a')[1];
    var data = null;
    var timer = null;
    var n = 0;
    //1.获取数据
    getData();
    function getData() {
        var xml = new XMLHttpRequest;
        xml.open('get', 'json/data.txt', false);
        xml.onreadystatechange = function () {
            if (xml.readyState == 4 && /^2\d{2}$/.test(xml.status)) {
                data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    }

    //2.绑定数据
    bind();
    function bind() {
        var strDiv = '';
        var strLi = '';
        for (var i = 0; i < data.length; i++) {
            strDiv += '<div><img src="" realImg="' + data[i].imgSrc + '" alt=""></div>';
            strLi += i == 0 ? '<li class="on"></li>' : '<li></li>';
        }
        oBoxInner.innerHTML = strDiv;
        oUl.innerHTML = strLi;
    }


    //3.延迟加载
    lazyImg();
    function lazyImg() {
        for (var i = 0; i < aImg.length; i++) {
            (function (index) {
                var curImg = aImg[index];
                var tmpImg = new Image;
                tmpImg.src = curImg.getAttribute('realImg');
                tmpImg.onload = function () {
                    curImg.src = this.src;
                    tmpImg = null;
                    utils.css(aDiv[0], 'zIndex', 1);
                    animate({
                        id: aDiv[0],
                        target: {
                            opacity: 1
                        }
                    })

                }
            })(i);
        }
    }

    //4.自动渐隐渐现
    timer = setInterval(autoMove, 2000);
    function autoMove() {
        if (n >= aDiv.length - 1) {
            n = -1;
        }
        n++;
        setBanner();
        //让那张图片显示：1）先把需要显示的图片层级提高，其他图片层级为0 2）透明度0-1，让兄弟元素，透明度为0：
    }

    function setBanner() {
        for (var i = 0; i < aDiv.length; i++) {
            if (i === n) {//要显示的图片
                utils.css(aDiv[i], {
                    zIndex: 1,
                });
                //aDiv[i].style.zIndex=1;
                animate({
                    id: aDiv[i],
                    target: {
                        opacity: 1,
                    },
                    callback: function () {
                        var siblings = utils.siblings(this);
                        for (var j = 0; j < siblings.length; j++) {
                            utils.css(siblings[j], 'opacity', 0);
                        }
                    }
                });
                continue;
            }
            utils.css(aDiv[i], 'zIndex', 0)
        }
    }
})();










