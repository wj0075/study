//1.获取要操作的元素2.获取数据3.绑定数据4.点击表头进行排序
~function () {
    var oTab = document.getElementById('box');
    var tHead = oTab.tHead;
    var aCells = tHead.rows[0].cells;//获取表头每一行的每一列
    var tBody = oTab.tBodies[0];
    var aRows = tBody.rows;//获取表体中的每一行
    var data = null;
    getData();
    function getData() {
        var xml = new XMLHttpRequest();
        xml.open('get', 'data.txt', false);
        xml.onreadystatechange = function () {
            if (xml.readyState === 4 && /^2\d{2}$/.test(xml.status)) {
                data = utils.jsonParse(xml.responseText)
            }
        };
        xml.send();
    }

    bind();
    function bind() {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            cur.sex = cur.sex === 0 ? '男' : '女';
            str += '<tr>\
            <td>' + cur.name + '</td>\
            <td>' + cur.age + '</td>\
            <td>' + cur.score + '</td>\
            <td>' + cur.sex + '</td>\
            </tr>'
        }
        tBody.innerHTML = str;
    }

    changeBg();
    function changeBg() {
        for (var i = 0; i < aRows.length; i++) {
            aRows[i].className = 'bg' + (i % 3 + 1);
        }
    }

    function sort(n) {
        var ary = utils.makeArray(aRows);
        for (var i = 0; i < aCells.length; i++) {
            i===n?aCells[i].flag *= -1:aCells[i].flag = -1;
            /*if (i === n) {
                aCells[i].flag *= -1;
            } else {
                aCells[i].flag = -1
            }*/
        }
        ary.sort(function (a, b) {
            a = a.cells[n].innerHTML;
            b = b.cells[n].innerHTML;
            if(isNaN(a)&&isNaN(b)){
                return a.localeCompare(b)*aCells[n].flag;
            }
            return (a - b)*aCells[n].flag;
        });
        var frg = document.createDocumentFragment();
        for(var i=0;i<ary.length;i++){
            frg.appendChild(ary[i]);
        }
        tBody.appendChild(frg);
        frg = null;
    }

    for (var i = 0; i < aCells.length; i++) {
        if (aCells[i].className == 'cursor') {
            aCells[i].flag = -1;
            aCells[i].index = i;
            aCells[i].onclick = function () {
                sort(this.index);
                changeBg();
            }
        }
    }


}();

